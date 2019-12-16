import React, { Component } from 'react';
import io from 'socket.io-client';
import STTScript from './STTScript';
import recordImage from '../../assets/icons/record_icon.png';
import { Button } from 'antd';

// for 개발 서버
//const END_POINT = '127.0.0.1:9000/';
// for 배포 서버
const END_POINT = 'www.meetingoverflow.space/';
const AudioContext = window.AudioContext || window.webkitAudioContext;

// Stream Audio Configuration
const bufferSize = 2048;
const context = new AudioContext();
let processor = null;
let input = null;
let globalStream = null;

let finalWord = false;
let streamStreaming = false;

let socket;

// AudioStream Constraints
const constraints = {
    audio: true,
    video: false
};

/**
 * @description Google STT component
 *
 * @usage
 * import googleSTT from 'googleSTT.js'
 *
 * render() {
 *     return(
 *         <googleSTT room={BLOCK_ID} />
 *     )
 * }
 */
class googleSTT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            room: this.props.room || Date.now(),
            recording: false,
            texts: [],
            currentText: '',
            somebodyRecording: false,
            recorderNickname: '',
            nickname: this.props.nickname || 'somebody'
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
        socket = io.connect(END_POINT);

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
                    {
                        texts: [transcript, ...this.state.texts],
                        currentText: ''
                    },
                    () => {
                        //TODO save to DB
                        /*
                        axios.patch(`api/${this.state.room}/`, {
                            recordedText: this.state.texts.join('\n')
                        });
                        */
                    }
                );
            } else {
                this.setState({
                    currentText: transcript
                });
            }
        });

        socket.on('somebodyStarted', data => {
            console.log('somebody started socket 받음');
            this.setState({
                somebodyRecording: data.somebodyRecording,
                recorderNickname: data.recorderNickname
            });
        });

        socket.emit('join', { room: this.state.room });
    };

    startSocket = () => {
        // TODO convert room id to block id
        //socket.emit('somebodyStarted', 'true');
    };

    stopSocket = () => {
        //socket.emit('leave', { room: this.state.room });
        //socket.emit('somebodyStarted', 'false');
    };

    //================= RECORDING =================
    initRecording = () => {
        socket.emit('startGoogleCloudStream', this.state.nickname); //init socket Google Speech Connection

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

    handleRecordingButton = () => {
        if (this.state.recording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    };

    startRecording = () => {
        this.setState({ recording: true });
        this.startSocket();
        if (!this.props.somebodyRecording) {
            this.initRecording();
        }
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

        this.stopSocket();
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
        const { recording, somebodyRecording } = this.state;
        console.log(this.state.somebodyRecording);
        return (
            <div className="googleSTT-container">
                <audio id="audio" ref={this.audio}></audio>

                {/* <div className="googleSTT-wrapper"> */}
                <div className="googleSTT-recording-view">
                    <Button
                        type="button"
                        onClick={this.handleRecordingButton}
                        disabled={somebodyRecording && !recording}
                        className={
                            !recording && somebodyRecording
                                ? 'disabled'
                                : 'recording-button'
                        }>
                        {recording ? 'Stop' : 'Start'}
                    </Button>
                    <img className="record-image" src={recordImage} />
                </div>
                <div>
                    {somebodyRecording &&
                        this.state.recorderNickname + ' is recording'}
                </div>
                <STTScript
                    scripts={this.state.texts}
                    lastScript={this.state.currentText}
                />
            </div>
            // </div>
        );
    }
}

export default googleSTT;
