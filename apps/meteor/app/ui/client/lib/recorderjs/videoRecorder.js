"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRecorder = void 0;
const reactive_var_1 = require("meteor/reactive-var");
class VideoRecorder {
    constructor() {
        this.cameraStarted = new reactive_var_1.ReactiveVar(false);
        this.started = false;
        this.recording = new reactive_var_1.ReactiveVar(false);
        this.recordingAvailable = new reactive_var_1.ReactiveVar(false);
        this.chunks = [];
    }
    getSupportedMimeTypes() {
        if (window.MediaRecorder.isTypeSupported('video/webm')) {
            return 'video/webm; codecs=vp8,opus';
        }
        if (window.MediaRecorder.isTypeSupported('video/mp4')) {
            return 'video/mp4';
        }
        return '';
    }
    start(videoel, cb) {
        var _a, _b, _c;
        this.videoel = videoel;
        const handleSuccess = (stream) => {
            this.startUserMedia(stream);
            cb === null || cb === void 0 ? void 0 : cb.call(this, true);
        };
        const handleError = (error) => {
            console.error(error);
            cb === null || cb === void 0 ? void 0 : cb.call(this, false);
        };
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(handleSuccess, handleError);
            return;
        }
        const oldGetUserMedia = (_c = (_b = (_a = navigator.getUserMedia) !== null && _a !== void 0 ? _a : navigator.webkitGetUserMedia) !== null && _b !== void 0 ? _b : navigator.mozGetUserMedia) !== null && _c !== void 0 ? _c : navigator.msGetUserMedia;
        if (oldGetUserMedia) {
            oldGetUserMedia.call(navigator, { audio: true, video: true }, handleSuccess, handleError);
            return;
        }
        cb === null || cb === void 0 ? void 0 : cb.call(this, false);
    }
    record() {
        this.chunks = [];
        if (!this.stream) {
            return;
        }
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.getSupportedMimeTypes() });
        this.mediaRecorder.ondataavailable = (blobev) => {
            this.chunks.push(blobev.data);
            if (!this.recordingAvailable.get()) {
                return this.recordingAvailable.set(true);
            }
        };
        this.mediaRecorder.start();
        return this.recording.set(true);
    }
    startUserMedia(stream) {
        if (!this.videoel) {
            return;
        }
        this.stream = stream;
        try {
            this.videoel.srcObject = stream;
        }
        catch (error) {
            const URL = window.URL || window.webkitURL;
            this.videoel.src = URL.createObjectURL(stream);
        }
        this.started = true;
        return this.cameraStarted.set(true);
    }
    stop(cb) {
        if (!this.started) {
            return;
        }
        this.stopRecording();
        if (this.stream) {
            const vtracks = this.stream.getVideoTracks();
            for (const vtrack of Array.from(vtracks)) {
                vtrack.stop();
            }
            const atracks = this.stream.getAudioTracks();
            for (const atrack of Array.from(atracks)) {
                atrack.stop();
            }
        }
        if (this.videoel) {
            this.videoel.pause;
            this.videoel.src = '';
        }
        this.started = false;
        this.cameraStarted.set(false);
        this.recordingAvailable.set(false);
        if (cb && this.chunks) {
            const blob = new Blob(this.chunks);
            cb(blob);
        }
        delete this.stream;
        delete this.videoel;
    }
    stopRecording() {
        if (!this.started || !this.recording || !this.mediaRecorder) {
            return;
        }
        this.mediaRecorder.stop();
        this.recording.set(false);
        delete this.mediaRecorder;
    }
}
const instance = new VideoRecorder();
exports.VideoRecorder = instance;
