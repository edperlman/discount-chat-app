"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioEncoder = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const meteor_1 = require("meteor/meteor");
class AudioEncoder extends emitter_1.Emitter {
    constructor(source, { bufferLen = 4096, numChannels = 1, bitRate = 32 } = {}) {
        super();
        this.handleWorkerMessage = (event) => {
            switch (event.data.command) {
                case 'end': {
                    // prepend mp3 magic number to the buffer
                    const magicNoPrefix = new Int8Array([73, 68, 51, 3, 0, 0, 0, 0, 0, 0]);
                    const bufferWithMagicNo = [magicNoPrefix, ...event.data.buffer];
                    const blob = new Blob(bufferWithMagicNo, { type: 'audio/mpeg' });
                    this.emit('encoded', blob);
                    this.worker.terminate();
                    break;
                }
            }
        };
        this.handleAudioProcess = (event) => {
            for (let channel = 0; channel < event.inputBuffer.numberOfChannels; channel++) {
                const buffer = event.inputBuffer.getChannelData(channel);
                this.worker.postMessage({
                    command: 'encode',
                    buffer,
                });
            }
        };
        const workerPath = meteor_1.Meteor.absoluteUrl('workers/mp3-encoder/index.js');
        this.worker = new Worker(workerPath);
        this.worker.onmessage = this.handleWorkerMessage;
        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: source.context.sampleRate,
                numChannels,
                bitRate,
            },
        });
        this.scriptNode = source.context.createScriptProcessor(bufferLen, numChannels, numChannels);
        this.scriptNode.onaudioprocess = this.handleAudioProcess;
        source.connect(this.scriptNode);
        this.scriptNode.connect(source.context.destination);
    }
    close() {
        this.worker.postMessage({ command: 'finish' });
    }
}
exports.AudioEncoder = AudioEncoder;
