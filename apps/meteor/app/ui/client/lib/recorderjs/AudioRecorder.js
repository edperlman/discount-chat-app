"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioRecorder = void 0;
const AudioEncoder_1 = require("./AudioEncoder");
const client_1 = require("../../../../settings/client");
class AudioRecorder {
    isSupported() {
        var _a;
        return Boolean((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) && Boolean(AudioContext);
    }
    createAudioContext() {
        if (this.audioContext) {
            return;
        }
        this.audioContext = new AudioContext();
    }
    destroyAudioContext() {
        if (!this.audioContext) {
            return;
        }
        void this.audioContext.close();
        delete this.audioContext;
    }
    createStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stream) {
                return;
            }
            this.stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        });
    }
    destroyStream() {
        if (!this.stream) {
            return;
        }
        this.stream.getAudioTracks().forEach((track) => track.stop());
        delete this.stream;
    }
    createEncoder() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.encoder || !this.audioContext || !this.stream) {
                return;
            }
            const input = (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.createMediaStreamSource(this.stream);
            this.encoder = new AudioEncoder_1.AudioEncoder(input, { bitRate: client_1.settings.get('Message_Audio_bitRate') || 32 });
        });
    }
    destroyEncoder() {
        if (!this.encoder) {
            return;
        }
        this.encoder.close();
        delete this.encoder;
    }
    start(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.createAudioContext();
                yield this.createStream();
                yield this.createEncoder();
                cb === null || cb === void 0 ? void 0 : cb.call(this, true);
            }
            catch (error) {
                console.error(error);
                this.destroyEncoder();
                this.destroyStream();
                this.destroyAudioContext();
                cb === null || cb === void 0 ? void 0 : cb.call(this, false);
                throw error;
            }
        });
    }
    stop(cb) {
        var _a, _b;
        (_a = this.encoder) === null || _a === void 0 ? void 0 : _a.on('encoded', cb);
        (_b = this.encoder) === null || _b === void 0 ? void 0 : _b.close();
        this.destroyEncoder();
        this.destroyStream();
        this.destroyAudioContext();
    }
}
exports.AudioRecorder = AudioRecorder;
