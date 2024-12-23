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
exports.EEVoipClient = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const sip_js_1 = require("sip.js");
const VoIPUser_1 = require("./VoIPUser");
class EEVoipClient extends VoIPUser_1.VoIPUser {
    constructor(config, mediaRenderer) {
        super(config, mediaRenderer);
    }
    makeCallURI(calleeURI, mediaRenderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mediaRenderer) {
                this.mediaStreamRendered = mediaRenderer;
            }
            if (this.session) {
                throw new Error('Session exists');
            }
            if (!this.userAgent) {
                throw new Error('No User Agent.');
            }
            if (this.callState !== 'REGISTERED') {
                throw new Error('Incorrect UA state');
            }
            const target = sip_js_1.UserAgent.makeURI(calleeURI);
            if (!target) {
                throw new Error(`Failed to create valid URI ${calleeURI}`);
            }
            // Replace this when device manager code is ready.
            const constraints = {
                audio: true,
                video: false,
            };
            const inviterOptions = {
                sessionDescriptionHandlerOptions: { constraints },
            };
            // Create a new Inviter for the outgoing Session
            const inviter = new sip_js_1.Inviter(this.userAgent, target, inviterOptions);
            this.session = inviter;
            this.setupSessionEventHandlers(inviter);
            this._opInProgress = core_typings_1.Operation.OP_SEND_INVITE;
            yield inviter.invite({
                requestDelegate: {
                    onReject: (response) => {
                        if (response.message.reasonPhrase) {
                            this.emit('callfailed', response.message.reasonPhrase || 'unknown');
                        }
                    },
                },
            });
            this._callState = 'OFFER_SENT';
            const callerInfo = {
                callerId: inviter.remoteIdentity.uri.user ? inviter.remoteIdentity.uri.user : '',
                callerName: inviter.remoteIdentity.displayName,
                host: inviter.remoteIdentity.uri.host,
            };
            this._callerInfo = callerInfo;
            this._userState = core_typings_1.UserState.UAC;
            this.emit('stateChanged');
        });
    }
    makeCall(calleeNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasPlusChar = calleeNumber.includes('+');
            const digits = calleeNumber.replace('+', '');
            this.makeCallURI(`sip:${hasPlusChar ? '*' : ''}${digits}@${this.userConfig.sipRegistrarHostnameOrIP}`);
        });
    }
    static create(config, mediaRenderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const voip = new EEVoipClient(config, mediaRenderer);
            yield voip.init();
            return voip;
        });
    }
}
exports.EEVoipClient = EEVoipClient;
