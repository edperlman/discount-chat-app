"use strict";
/**
 * This class is used for local stream manipulation.
 * @remarks
 * This class wraps up browser media stream and HTMLMedia element
 * and takes care of rendering the media on a given element.
 * This provides enough abstraction so that the higher level
 * classes do not need to know about the browser specificities for
 * media.
 * This will also provide stream related functionalities such as
 * mixing of 2 streams in to 2, adding/removing tracks, getting a track information
 * detecting voice energy etc. Which will be implemented as when needed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stream_1 = __importDefault(require("./Stream"));
class RemoteStream extends Stream_1.default {
    constructor(mediaStream) {
        super(mediaStream);
    }
    /**
     * Called for initializing the class
     * @remarks
     */
    init(rmElement) {
        if (this.renderingMediaElement) {
            // Someone already has setup the stream and initializing it once again
            // Clear the existing stream object
            this.renderingMediaElement.pause();
            this.renderingMediaElement.srcObject = null;
        }
        this.renderingMediaElement = rmElement;
    }
    /**
     * Called for playing the stream
     * @remarks
     * Plays the stream on media element. Stream will be autoplayed and muted based on the settings.
     * throws and error if the play fails.
     */
    play(autoPlay = true, muteAudio = false) {
        if (this.renderingMediaElement && this.mediaStream) {
            this.renderingMediaElement.autoplay = autoPlay;
            this.renderingMediaElement.srcObject = this.mediaStream;
            if (autoPlay) {
                this.renderingMediaElement.play().catch((error) => {
                    throw error;
                });
            }
            if (muteAudio) {
                this.renderingMediaElement.volume = 0;
            }
        }
    }
    /**
     * Called for pausing the stream
     * @remarks
     */
    pause() {
        var _a;
        (_a = this.renderingMediaElement) === null || _a === void 0 ? void 0 : _a.pause();
    }
    clear() {
        super.clear();
        if (this.renderingMediaElement) {
            this.renderingMediaElement.pause();
            this.renderingMediaElement.srcObject = null;
        }
    }
}
exports.default = RemoteStream;
