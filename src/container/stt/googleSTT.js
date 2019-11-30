import React, { Component } from 'react';
import io from 'socket.io-client';
import { map } from 'lodash';
import axios from 'axios';

const END_POINT = '127.0.0.1:9000/';
const AudioContext = window.AudioContext || window.webkitAudioContext;

// Stream Audio Configuration
const bufferSize = 2048;
const context = new AudioContext();
let processor = null;
let input = null;
let globalStream = null;

let finalWord = false;
let streamStreaming = false;

const socket = io.connect(END_POINT);

// AudioStream Constraints
const constraints = {
    audio: true,
    video: false
};
// let resultText = null;

class googleSTT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            room: '',
            recording: false,
            texts: []
        };

        // Audio Element
        this.audio = React.createRef();
    }

    componentDidMount() {
        this.initSocket();

        //TODO fetch recorded text from DB
        /*
        axios
            .get(`api/${this.state.room}/recordedText/`)
            .then(res => this.setState({ texts: res.split('\n') }));
        */
    }

    initSocket = () => {
        //================= SOCKET IO =================
        socket.on('connect', data => {
            console.log(data);
            console.log('Server Connected to Client');
        });
        socket.on('messages', data => {
            console.log(data);
        });

        socket.on('speechData', data => {
            const transcript = data.results[0].alternatives[0].transcript;
            const isFinal = data.results[0].isFinal;
            if (isFinal) {
                console.log(transcript);
                this.setState(
                    { texts: [...this.state.texts, transcript] },
                    () => {
                        //TODO save to DB
                        /*
                        axios.patch(`api/${this.state.room}/`, {
                            recordedText: this.state.texts.join('\n')
                        });
                        */
                    }
                );
            }
            // resultText.innerText = data.results[0] && data.results[0].alternatives[0].transcript;
        });
    };

    startSocket = () => {
        // TODO convert room id to block id
        socket.emit('join', { room: this.state.room });
    };

    stopSocket = () => {
        socket.emit('leave', { room: this.state.room });
    };

    //================= RECORDING =================
    initRecording = () => {
        socket.emit('startGoogleCloudStream', ''); //init socket Google Speech Connection
        streamStreaming = true;
        processor = context.createScriptProcessor(bufferSize, 1, 1);
        processor.connect(context.destination);
        if (context.state === 'running') console.log('start');
        if (context.state !== 'running')
            context.resume().then(() => console.log('restart'));

        const handleSuccess = stream => {
            globalStream = stream;

            input = context.createMediaStreamSource(stream);
            input.connect(processor);

            processor.onaudioprocess = e => {
                const left = e.inputBuffer.getChannelData(0);
                const left16 = this.downsampleBuffer(left, 44100, 16000);
                socket.emit('binaryData', left16);
            };
        };

        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
    };

    startRecording = () => {
        this.setState({ recording: true });
        this.initRecording();
    };

    stopRecording = () => {
        this.setState({ recording: false });

        streamStreaming = false;
        socket.emit('endGoogleCloudStream', '');

        const track = globalStream.getTracks()[0];
        track.stop();

        input.disconnect(processor);
        processor.disconnect(context.destination);
        context.suspend().then(() => {
            console.log('suspend');
            input = null;
            processor = null;
        });
    };

    //================= HELPERS =================
    // sampleRateHertz 16000 //saved sound is awefull
    convertFloat32ToInt16 = buffer => {
        let l = buffer.length;
        let buf = new Int16Array(l / 3);

        while (l--) {
            if (l % 3 == 0) {
                buf[l / 3] = buffer[l] * 0xffff;
            }
        }
        return buf.buffer;
    };

    downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
        if (outSampleRate == sampleRate) {
            return buffer;
        }
        if (outSampleRate > sampleRate) {
            throw 'downsampling rate show be smaller than original sample rate';
        }
        let sampleRateRatio = sampleRate / outSampleRate;
        let newLength = Math.round(buffer.length / sampleRateRatio);
        let result = new Int16Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult < result.length) {
            let nextOffsetBuffer = Math.round(
                (offsetResult + 1) * sampleRateRatio
            );
            let accum = 0;
            let count = 0;

            for (
                let i = offsetBuffer;
                i < nextOffsetBuffer && i < buffer.length;
                i++
            ) {
                accum += buffer[i];
                count++;
            }

            result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result.buffer;
    };

    capitalize = s => {
        if (s.length < 1) {
            return s;
        }
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    render() {
        const { recording, texts } = this.state;
        return (
            <div>
                <audio id="audio" ref={this.audio}></audio>

                <button
                    type="button"
                    onClick={this.startRecording}
                    disabled={recording}
                    className={recording ? 'disabled' : ''}>
                    Start recording
                </button>
                <button
                    type="button"
                    onClick={this.stopRecording}
                    disabled={!recording}
                    className={recording ? '' : 'disabled'}>
                    Stop recording
                </button>
                <input
                    onChange={e => this.setState({ room: e.target.value })}
                    value={this.state.room}
                />
                <button type="button" onClick={this.startSocket}>
                    Start Socket
                </button>
                <button type="button" onClick={this.stopSocket}>
                    Stop Socket
                </button>

                <div>
                    {/* <p id="resultText"></p> */}
                    {map(texts, (text, i) => (
                        <div key={i}>{text}</div>
                    ))}
                </div>
            </div>
        );
    }
}

export default googleSTT;