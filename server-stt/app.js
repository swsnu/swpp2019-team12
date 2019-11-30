const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const googleSTTRouter = require('./routes/googleSTT');

const fs = require('fs');
const environmentVars = require('dotenv').config();

// Google Cloud
const speech = require('@google-cloud/speech');
// Creates a client
const speechClient = new speech.SpeechClient();

const app = express();

const port = process.env.PORT || 9000;
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route
app.use('/stt', googleSTTRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// =========================== SOCKET.IO ================================ //

let room;

io.on('connection', client => {
    console.log(`Client Connected to server : ${client.id}`);
    let recognizeStream = null;

    client.on('join', data => {
        room = data.room;

        client.join(room);
        io.to(room).emit(
            'messages',
            `Socket Connected to Server - room name : ${room}`
        );
    });

    client.on('leave', data => {
        client.leave(room);
        client.leave(data.room);
        console.log('Socket Disconnected to Server');
    });

    client.on('messages', data => {
        // io.sockets.in(room).emit('broad', data);
        io.to(room).emit('broad', data);
    });

    client.on('startGoogleCloudStream', data => {
        console.log('========= LOG =========');
        console.log('start google cloud stream');
        console.log('========= END =========');
        startRecognitionStream(client);
    });

    client.on('endGoogleCloudStream', data => {
        console.log('========= LOG =========');
        console.log('end google cloud stream');
        console.log('========= END =========');
        stopRecognitionStream(client);
    });

    client.on('binaryData', data => {
        if (recognizeStream !== null) {
            recognizeStream.write(data);
        }
        if (recognizeStream !== null && recognizeStream.destroyed) {
            startRecognitionStream(client);
        }
    });

    const startRecognitionStream = client => {
        recognizeStream = speechClient
            .streamingRecognize(request)
            .on('error', console.error)
            .on('data', data => {
                process.stdout.write(
                    data.results[0] && data.results[0].alternatives[0]
                        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                        : `\n\nReached transcription time limit, press Ctrl+C\n`
                );
                io.to(room).emit('speechData', data);
                // io.sockets.in(room).emit('speechData', data);

                // if end of utterance, let's restart stream
                // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
                /*
                if (data.results[0] && data.results[0].isFinal) {
                    stopRecognitionStream();
                    startRecognitionStream(client);
                    // console.log('restarted stream serverside');
                }
                */
            });
    };

    const stopRecognitionStream = client => {
        if (recognizeStream) {
            recognizeStream.end();
        }
        recognizeStream = null;
        client.leave(room);
    };
});

// =========================== GOOGLE CLOUD SETTINGS ================================ //

// The encoding of the audio file, e.g. 'LINEAR16'
// The sample rate of the audio file in hertz, e.g. 16000
// The BCP-47 language code to use, e.g. 'en-US'
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'ko-KR'; //en-US

const request = {
    config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        profanityFilter: false,
        enableWordTimeOffsets: true
    },
    interimResults: true // If you want interim results, set this to true
};

// =========================== START SERVER ================================ //

server.listen(port, '127.0.0.1', () => {
    console.log('Server started on port:' + port);
});

module.exports = app;
