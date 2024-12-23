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
exports.toggleMediaStreamTracks = toggleMediaStreamTracks;
const web_1 = require("sip.js/lib/platform/web");
/** Helper function to enable/disable media tracks. */
function toggleMediaStreamTracks(enable, session, direction) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionDescriptionHandler } = session;
        if (!(sessionDescriptionHandler instanceof web_1.SessionDescriptionHandler)) {
            throw new Error("Session's session description handler not instance of SessionDescriptionHandler.");
        }
        const { peerConnection } = sessionDescriptionHandler;
        if (!peerConnection) {
            throw new Error('Peer connection closed.');
        }
        let mediaStreams = null;
        if (direction === 'sender') {
            mediaStreams = peerConnection.getSenders();
        }
        else if (direction === 'receiver') {
            mediaStreams = peerConnection.getReceivers();
        }
        if (mediaStreams) {
            mediaStreams.forEach((stream) => {
                if (stream.track) {
                    stream.track.enabled = enable;
                }
            });
        }
    });
}
