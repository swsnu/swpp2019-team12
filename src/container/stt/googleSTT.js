import React, { Component } from 'react';
import io from 'socket.io-client';
import nlp from 'compromise';

const END_POINT = '127.0.0.1:9000/';
const AudioContext = window.AudioContext || window.webkitAudioContext;

const socket = io.connect(END_POINT);

// Stream Audio Configuration
const bufferSize = 2048;
const context = new AudioContext();
let processor = null;
let input = null;
let globalStream = null;

let finalWord = false;
let removeLastSentence = true;
let streamStreaming = false;

// AudioStream Constraints
const constraints = {
    audio: true,
    video: false
};
let resultText = null;

class googleSTT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recording: false
        };

        // Audio Element
        this.audio = React.createRef();
    }

    componentDidMount() {
        resultText = document.querySelector('#resultText');
        //================= SOCKET IO =================
        socket.on('connect', data => {
            socket.emit('join', 'Server Connected to Client');
        });

        socket.on('messages', data => {
            console.log(data);
        });

        socket.on('speechData', data => {
            console.log(data.results[0].alternatives[0].transcript);
            resultText.innerText =
                data.results[0] && data.results[0].alternatives[0].transcript;
            // var dataFinal = undefined || data.results[0].isFinal;

            // if (dataFinal === false) {
            // console.log(resultText.lastElementChild);
            // if (removeLastSentence) {
            // resultText.lastElementChild.remove();
            // }
            // removeLastSentence = true;

            //add empty span
            // let empty = document.createElement('span');
            // resultText.appendChild(empty);

            //add children to empty span

            // resultText.innerHTML =
            // data.result[0] && data.result[0].alternatives[0].transcript;
            /*
                let edit = this.addTimeSettingsInterim(data);

                for (let i = 0; i < edit.length; i++) {
                    resultText.lastElementChild.appendChild(edit[i]);
                    resultText.lastElementChild.appendChild(
                        document.createTextNode('\u00A0')
                    );
                }
                */
            // } else if (dataFinal === true) {
            // resultText.lastElementChild.remove();

            //add empty span
            // let empty = document.createElement('span');
            // resultText.appendChild(empty);

            // resultText.innerHTML =
            // data.result[0] && data.result[0].alternatives[0].transcript;

            //add children to empty span
            /*
                let edit = this.addTimeSettingsFinal(data);
                for (let i = 0; i < edit.length; i++) {
                    if (i === 0) {
                        edit[i].innerText = this.capitalize(edit[i].innerText);
                    }
                    resultText.lastElementChild.appendChild(edit[i]);

                    if (i !== edit.length - 1) {
                        resultText.lastElementChild.appendChild(
                            document.createTextNode('\u00A0')
                        );
                    }
                }
                resultText.lastElementChild.appendChild(
                    document.createTextNode('\u002E\u00A0')
                );
                */

            // console.log("Google Speech sent 'final' Sentence.");
            // finalWord = true;
            // removeLastSentence = false;
            // }
        });
    }

    //================= RECORDING =================
    initRecording = () => {
        socket.emit('startGoogleCloudStream', ''); //init socket Google Speech Connection
        streamStreaming = true;
        processor = context.createScriptProcessor(bufferSize, 1, 1);
        processor.connect(context.destination);
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

    //================= Juggling Spans for nlp Coloring =================
    addTimeSettingsInterim = speechData => {
        let wholeString = speechData.results[0].alternatives[0].transcript;
        console.log(wholeString);

        let nlpObject = nlp(wholeString).out('terms');

        let words_without_time = [];

        for (let i = 0; i < nlpObject.length; i++) {
            //data
            let word = nlpObject[i].text;
            let tags = [];

            //generate span
            let newSpan = document.createElement('span');
            newSpan.innerHTML = word;

            //push all tags
            for (let j = 0; j < nlpObject[i].tags.length; j++) {
                tags.push(nlpObject[i].tags[j]);
            }

            //add all classes
            for (let j = 0; j < nlpObject[i].tags.length; j++) {
                let cleanClassName = tags[j];
                // console.log(tags);
                let className = `nl-${cleanClassName}`;
                newSpan.classList.add(className);
            }

            words_without_time.push(newSpan);
        }

        finalWord = false;

        return words_without_time;
    };

    addTimeSettingsFinal = speechData => {
        let wholeString = speechData.results[0].alternatives[0].transcript;

        let nlpObject = nlp(wholeString).out('terms');
        let words = speechData.results[0].alternatives[0].words;

        let words_n_time = [];

        for (let i = 0; i < words.length; i++) {
            //data
            let word = words[i].word;
            let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
            let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
            let tags = [];

            //generate span
            let newSpan = document.createElement('span');
            newSpan.innerHTML = word;
            newSpan.dataset.startTime = startTime;

            //push all tags
            for (let j = 0; j < nlpObject[i].tags.length; j++) {
                tags.push(nlpObject[i].tags[j]);
            }

            //add all classes
            for (let j = 0; j < nlpObject[i].tags.length; j++) {
                let cleanClassName = nlpObject[i].tags[j];
                // console.log(tags);
                let className = `nl-${cleanClassName}`;
                newSpan.classList.add(className);
            }

            words_n_time.push(newSpan);
        }

        return words_n_time;
    };

    //================= SANTAS HELPERS =================

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
        var sampleRateRatio = sampleRate / outSampleRate;
        var newLength = Math.round(buffer.length / sampleRateRatio);
        var result = new Int16Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round(
                (offsetResult + 1) * sampleRateRatio
            );
            var accum = 0,
                count = 0;
            for (
                var i = offsetBuffer;
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
        const { recording } = this.state;
        return (
            <div>
                <audio id="audio" ref={this.audio}></audio>

                <button
                    type="button"
                    onClick={this.startRecording}
                    // disabled={recording}
                >
                    Start recording
                </button>
                <button
                    type="button"
                    onClick={this.stopRecording}
                    // disabled={!recording}
                >
                    Stop recording
                </button>

                <div>
                    <p id="resultText">
                        {/* <span className="greyText">No Speech to Text yet</span> */}
                    </p>
                </div>
            </div>
        );
    }
}

export default googleSTT;
