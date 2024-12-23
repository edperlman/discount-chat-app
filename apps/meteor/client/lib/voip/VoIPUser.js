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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoIPUser = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const emitter_1 = require("@rocket.chat/emitter");
const sip_js_1 = require("sip.js");
const core_1 = require("sip.js/lib/core");
const web_1 = require("sip.js/lib/platform/web");
const Helper_1 = require("./Helper");
const LocalStream_1 = __importDefault(require("./LocalStream"));
const QueueAggregator_1 = require("./QueueAggregator");
const RemoteStream_1 = __importDefault(require("./RemoteStream"));
class VoIPUser extends emitter_1.Emitter {
    get operationInProgress() {
        return this._opInProgress;
    }
    get userState() {
        return this._userState;
    }
    constructor(config, mediaRenderer) {
        super();
        this.config = config;
        this.state = {
            isReady: false,
            enableVideo: false,
        };
        this.userAgentOptions = {};
        this._connectionState = 'INITIAL';
        this._held = false;
        this.optionsKeepaliveInterval = 5;
        this.optionsKeepAliveDebounceTimeInSec = 5;
        this.attemptRegistration = false;
        this._callState = 'INITIAL';
        this._userState = core_typings_1.UserState.IDLE;
        this._opInProgress = core_typings_1.Operation.OP_NONE;
        this.mediaStreamRendered = mediaRenderer;
        this.networkEmitter = new emitter_1.Emitter();
        this.connectionRetryCount = this.config.connectionRetryCount;
        this.stop = false;
        this.onlineNetworkHandler = this.onNetworkRestored.bind(this);
        this.offlineNetworkHandler = this.onNetworkLost.bind(this);
    }
    /**
     * Configures and initializes sip.js UserAgent
     * call gets established.
     * @remarks
     * This class configures transport properties such as websocket url, passed down in config,
     * sets up ICE servers,
     * SIP UserAgent options such as userName, Password, URI.
     * Once initialized, it starts the userAgent.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const sipUri = `sip:${this.config.authUserName}@${this.config.sipRegistrarHostnameOrIP}`;
            const transportOptions = {
                server: this.config.webSocketURI,
                connectionTimeout: 100, // Replace this with config
                keepAliveInterval: 20,
                // traceSip: true,
            };
            const sdpFactoryOptions = {
                iceGatheringTimeout: 10,
                peerConnectionConfiguration: {
                    iceServers: this.config.iceServers,
                },
            };
            this.userAgentOptions = {
                delegate: {
                    onInvite: (invitation) => __awaiter(this, void 0, void 0, function* () {
                        yield this.handleIncomingCall(invitation);
                    }),
                },
                authorizationPassword: this.config.authPassword,
                authorizationUsername: this.config.authUserName,
                uri: sip_js_1.UserAgent.makeURI(sipUri),
                transportOptions,
                sessionDescriptionHandlerFactoryOptions: sdpFactoryOptions,
                logConfiguration: false,
                logLevel: 'error',
            };
            this.userAgent = new sip_js_1.UserAgent(this.userAgentOptions);
            this.userAgent.transport.isConnected();
            this._opInProgress = core_typings_1.Operation.OP_CONNECT;
            try {
                this.registerer = new sip_js_1.Registerer(this.userAgent);
                this.userAgent.transport.onConnect = this.onConnected.bind(this);
                this.userAgent.transport.onDisconnect = this.onDisconnected.bind(this);
                window.addEventListener('online', this.onlineNetworkHandler);
                window.addEventListener('offline', this.offlineNetworkHandler);
                yield this.userAgent.start();
                if (this.config.enableKeepAliveUsingOptionsForUnstableNetworks) {
                    this.startOptionsPingForUnstableNetworks();
                }
            }
            catch (error) {
                this._connectionState = 'ERROR';
                throw error;
            }
        });
    }
    onConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            this._connectionState = 'SERVER_CONNECTED';
            this.state.isReady = true;
            this.sendOptions();
            this.networkEmitter.emit('connected');
            /**
             * Re-registration post network recovery should be attempted
             * if it was previously registered or incall/onhold
             */
            if (this.registerer && this.callState !== 'INITIAL') {
                this.attemptRegistration = true;
            }
        });
    }
    onDisconnected(error) {
        this._connectionState = 'SERVER_DISCONNECTED';
        this._opInProgress = core_typings_1.Operation.OP_NONE;
        this.networkEmitter.emit('disconnected');
        if (error) {
            this.networkEmitter.emit('connectionerror', error);
            this.state.isReady = false;
            /**
             * Signalling socket reconnection should be attempted assuming
             * that the disconnect happened from the remote side or due to sleep
             * In case of remote side disconnection, if config.connectionRetryCount is -1,
             * attemptReconnection attempts continuously. Else stops after |config.connectionRetryCount|
             *
             */
            // this.attemptReconnection();
            this.attemptReconnection(0, false);
        }
    }
    onNetworkRestored() {
        this.networkEmitter.emit('localnetworkonline');
        if (this._connectionState === 'WAITING_FOR_NETWORK') {
            /**
             * Signalling socket reconnection should be attempted when online event handler
             * gets notified.
             * Important thing to note is that the second parameter |checkRegistration| = true passed here
             * because after the network recovery and after reconnecting to the server,
             * the transport layer of SIPUA does not call onConnected. So by passing |checkRegistration = true |
             * the code will check if the endpoint was previously registered before the disconnection.
             * If such is the case, it will first unregister and then re-register.
             * */
            this.attemptReconnection();
            if (this.registerer && this.callState !== 'INITIAL') {
                this.attemptRegistration = true;
            }
        }
    }
    onNetworkLost() {
        this.networkEmitter.emit('localnetworkoffline');
        this._connectionState = 'WAITING_FOR_NETWORK';
    }
    get userConfig() {
        return this.config;
    }
    get callState() {
        return this._callState;
    }
    get connectionState() {
        return this._connectionState;
    }
    get callerInfo() {
        if (this.callState === 'IN_CALL' ||
            this.callState === 'OFFER_RECEIVED' ||
            this.callState === 'ON_HOLD' ||
            this.callState === 'OFFER_SENT') {
            if (!this._callerInfo) {
                throw new Error('[VoIPUser callerInfo] invalid state');
            }
            return {
                state: this.callState,
                caller: this._callerInfo,
                userState: this._userState,
            };
        }
        return {
            state: this.callState,
            userState: this._userState,
        };
    }
    /* Media Stream functions begin */
    /** The local media stream. Undefined if call not answered. */
    get localMediaStream() {
        var _a;
        const sdh = (_a = this.session) === null || _a === void 0 ? void 0 : _a.sessionDescriptionHandler;
        if (!sdh) {
            return undefined;
        }
        if (!(sdh instanceof web_1.SessionDescriptionHandler)) {
            throw new Error('Session description handler not instance of web SessionDescriptionHandler');
        }
        return sdh.localMediaStream;
    }
    /* Media Stream functions end */
    /* OutgoingRequestDelegate methods begin */
    onRegistrationRequestAccept() {
        if (this._opInProgress === core_typings_1.Operation.OP_REGISTER) {
            this._callState = 'REGISTERED';
            this.emit('registered');
            this.emit('stateChanged');
        }
        if (this._opInProgress === core_typings_1.Operation.OP_UNREGISTER) {
            this._callState = 'UNREGISTERED';
            this.emit('unregistered');
            this.emit('stateChanged');
        }
    }
    onRegistrationRequestReject(error) {
        if (this._opInProgress === core_typings_1.Operation.OP_REGISTER) {
            this.emit('registrationerror', error);
        }
        if (this._opInProgress === core_typings_1.Operation.OP_UNREGISTER) {
            this.emit('unregistrationerror', error);
        }
    }
    /* OutgoingRequestDelegate methods end */
    handleIncomingCall(invitation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.callState === 'REGISTERED') {
                this._opInProgress = core_typings_1.Operation.OP_PROCESS_INVITE;
                this._callState = 'OFFER_RECEIVED';
                this._userState = core_typings_1.UserState.UAS;
                this.session = invitation;
                this.setupSessionEventHandlers(invitation);
                const callerInfo = {
                    callerId: invitation.remoteIdentity.uri.user ? invitation.remoteIdentity.uri.user : '',
                    callerName: invitation.remoteIdentity.displayName,
                    host: invitation.remoteIdentity.uri.host,
                };
                this._callerInfo = callerInfo;
                this.emit('incomingcall', callerInfo);
                this.emit('stateChanged');
                return;
            }
            yield invitation.reject();
        });
    }
    /**
     * Sets up an listener handler for handling session's state change
     * @remarks
     * Called for setting up various state listeners. These listeners will
     * decide the next action to be taken when the session state changes.
     * e.g when session.state changes from |Establishing| to |Established|
     * one must set up local and remote media rendering.
     *
     * This class handles such session state changes and takes necessary actions.
     */
    setupSessionEventHandlers(session) {
        var _a;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.stateChange.addListener((state) => {
            var _a;
            if (this.session !== session) {
                return; // if our session has changed, just return
            }
            switch (state) {
                case sip_js_1.SessionState.Initial:
                    break;
                case sip_js_1.SessionState.Establishing:
                    this.emit('ringing', { userState: this._userState, callInfo: this._callerInfo });
                    break;
                case sip_js_1.SessionState.Established:
                    if (this._userState === core_typings_1.UserState.UAC) {
                        /**
                         * We need to decide about user-state ANSWER-RECEIVED for outbound.
                         * This state is there for the symmetry of ANSWER-SENT.
                         * ANSWER-SENT occurs when there is incoming invite. So then the UA
                         * accepts a call, it sends the answer and state becomes ANSWER-SENT.
                         * The call gets established only when the remote party sends ACK.
                         *
                         * But in case of UAC where the invite is sent out, there is no intermediate
                         * state where the UA can be in ANSWER-RECEIVED. As soon this UA receives the answer,
                         * it sends ack and changes the SessionState to established.
                         *
                         * So we do not have an actual state transitions from ANSWER-RECEIVED to IN-CALL.
                         *
                         * Nevertheless, this state is just added to maintain the symmetry. This can be safely removed.
                         *
                         * */
                        this._callState = 'ANSWER_RECEIVED';
                    }
                    this._opInProgress = core_typings_1.Operation.OP_NONE;
                    this.setupRemoteMedia();
                    this._callState = 'IN_CALL';
                    this.emit('callestablished', { userState: this._userState, callInfo: this._callerInfo });
                    this.emit('stateChanged');
                    break;
                case sip_js_1.SessionState.Terminating:
                // fall through
                case sip_js_1.SessionState.Terminated:
                    this.session = undefined;
                    this._callState = 'REGISTERED';
                    this._opInProgress = core_typings_1.Operation.OP_NONE;
                    this._userState = core_typings_1.UserState.IDLE;
                    this.emit('callterminated');
                    (_a = this.remoteStream) === null || _a === void 0 ? void 0 : _a.clear();
                    this.emit('stateChanged');
                    break;
                default:
                    throw new Error('Unknown session state.');
            }
        });
    }
    onTrackAdded(_event) {
        console.log('onTrackAdded');
    }
    onTrackRemoved(_event) {
        console.log('onTrackRemoved');
    }
    /**
     * Carries out necessary steps for rendering remote media whe
     * call gets established.
     * @remarks
     * Sets up Stream class and plays the stream on given Media element/
     * Also sets up various event handlers.
     */
    setupRemoteMedia() {
        var _a, _b;
        if (!this.session) {
            throw new Error('Session does not exist.');
        }
        const sdh = (_a = this.session) === null || _a === void 0 ? void 0 : _a.sessionDescriptionHandler;
        if (!sdh) {
            return undefined;
        }
        if (!(sdh instanceof web_1.SessionDescriptionHandler)) {
            throw new Error('Session description handler not instance of web SessionDescriptionHandler');
        }
        const remoteStream = sdh.remoteMediaStream;
        if (!remoteStream) {
            throw new Error('Remote media stream is undefined.');
        }
        this.remoteStream = new RemoteStream_1.default(remoteStream);
        const mediaElement = (_b = this.mediaStreamRendered) === null || _b === void 0 ? void 0 : _b.remoteMediaElement;
        if (mediaElement) {
            this.remoteStream.init(mediaElement);
            this.remoteStream.onTrackAdded(this.onTrackAdded.bind(this));
            this.remoteStream.onTrackRemoved(this.onTrackRemoved.bind(this));
            this.remoteStream.play();
        }
    }
    /**
     * Handles call mute-unmute
     */
    handleMuteUnmute(muteState) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { session } = this;
            if (this._held === muteState) {
                return Promise.resolve();
            }
            if (!session) {
                throw new Error('Session not found');
            }
            const sessionDescriptionHandler = (_a = this.session) === null || _a === void 0 ? void 0 : _a.sessionDescriptionHandler;
            if (!(sessionDescriptionHandler instanceof web_1.SessionDescriptionHandler)) {
                throw new Error("Session's session description handler not instance of SessionDescriptionHandler.");
            }
            const options = {
                requestDelegate: {
                    onAccept: () => {
                        this._held = muteState;
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'receiver');
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'sender');
                    },
                    onReject: () => {
                        this.emit('muteerror');
                    },
                },
            };
            const { peerConnection } = sessionDescriptionHandler;
            if (!peerConnection) {
                throw new Error('Peer connection closed.');
            }
            return (_b = this.session) === null || _b === void 0 ? void 0 : _b.invite(options).then(() => {
                (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'receiver');
                (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'sender');
            }).catch((error) => {
                var _a;
                if (error instanceof sip_js_1.RequestPendingError) {
                    console.error(`[${(_a = this.session) === null || _a === void 0 ? void 0 : _a.id}] A mute request is already in progress.`);
                }
                this.emit('muteerror');
                throw error;
            });
        });
    }
    /**
     * Handles call hold-unhold
     */
    handleHoldUnhold(holdState) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { session } = this;
            if (this._held === holdState) {
                return Promise.resolve();
            }
            if (!session) {
                throw new Error('Session not found');
            }
            const sessionDescriptionHandler = (_a = this.session) === null || _a === void 0 ? void 0 : _a.sessionDescriptionHandler;
            if (!(sessionDescriptionHandler instanceof web_1.SessionDescriptionHandler)) {
                throw new Error("Session's session description handler not instance of SessionDescriptionHandler.");
            }
            const options = {
                requestDelegate: {
                    onAccept: () => {
                        this._held = holdState;
                        this._callState = holdState ? 'ON_HOLD' : 'IN_CALL';
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'receiver');
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'sender');
                        this._callState === 'ON_HOLD' ? this.emit('hold') : this.emit('unhold');
                        this.emit('stateChanged');
                    },
                    onReject: () => {
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'receiver');
                        (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'sender');
                        this.emit('holderror');
                    },
                },
            };
            // Session properties used to pass options to the SessionDescriptionHandler:
            //
            // 1) Session.sessionDescriptionHandlerOptions
            //    SDH options for the initial INVITE transaction.
            //    - Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
            //    - May be set directly at anytime.
            //    - May optionally be set via constructor option.
            //    - May optionally be set via options passed to Inviter.invite() or Invitation.accept().
            //
            // 2) Session.sessionDescriptionHandlerOptionsReInvite
            //    SDH options for re-INVITE transactions.
            //    - Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
            //    - May be set directly at anytime.
            //    - May optionally be set via constructor option.
            //    - May optionally be set via options passed to Session.invite().
            const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
            sessionDescriptionHandlerOptions.hold = holdState;
            session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;
            const { peerConnection } = sessionDescriptionHandler;
            if (!peerConnection) {
                throw new Error('Peer connection closed.');
            }
            return (_b = this.session) === null || _b === void 0 ? void 0 : _b.invite(options).then(() => {
                (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'receiver');
                (0, Helper_1.toggleMediaStreamTracks)(!this._held, session, 'sender');
            }).catch((error) => {
                var _a;
                if (error instanceof sip_js_1.RequestPendingError) {
                    console.error(`[${(_a = this.session) === null || _a === void 0 ? void 0 : _a.id}] A hold request is already in progress.`);
                }
                this.emit('holderror');
                throw error;
            });
        });
    }
    static create(config, mediaRenderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const voip = new VoIPUser(config, mediaRenderer);
            yield voip.init();
            return voip;
        });
    }
    /**
     * Sends SIP OPTIONS message to asterisk
     *
     * There is an interesting problem that happens with Asterisk.
     * After websocket connection succeeds and if there is no SIP
     * message goes in 30 seconds, asterisk disconnects the socket.
     *
     * If any SIP message goes before 30 seconds, asterisk holds the connection.
     * This problem could be solved in multiple ways. One is that
     * whenever disconnect happens make sure that the socket is connected back using
     * this.userAgent.reconnect() method. But this is expensive as it does connect-disconnect
     * every 30 seconds till we send register message.
     *
     * Another approach is to send SIP OPTIONS just to tell server that
     * there is a UA using this socket. This is implemented below
     */
    sendOptions(outgoingRequestDelegate) {
        var _a, _b;
        const uri = new core_1.URI('sip', this.config.authUserName, this.config.sipRegistrarHostnameOrIP);
        const outgoingMessage = (_a = this.userAgent) === null || _a === void 0 ? void 0 : _a.userAgentCore.makeOutgoingRequestMessage('OPTIONS', uri, uri, uri, {});
        if (outgoingMessage) {
            (_b = this.userAgent) === null || _b === void 0 ? void 0 : _b.userAgentCore.request(outgoingMessage, outgoingRequestDelegate);
        }
    }
    /**
     * Public method called from outside to register the SIP UA with call server.
     * @remarks
     */
    register() {
        var _a;
        this._opInProgress = core_typings_1.Operation.OP_REGISTER;
        (_a = this.registerer) === null || _a === void 0 ? void 0 : _a.register({
            requestDelegate: {
                onAccept: this.onRegistrationRequestAccept.bind(this),
                onReject: this.onRegistrationRequestReject.bind(this),
            },
        });
    }
    /**
     * Public method called from outside to unregister the SIP UA.
     * @remarks
     */
    unregister() {
        var _a;
        this._opInProgress = core_typings_1.Operation.OP_UNREGISTER;
        (_a = this.registerer) === null || _a === void 0 ? void 0 : _a.unregister({
            all: true,
            requestDelegate: {
                onAccept: this.onRegistrationRequestAccept.bind(this),
                onReject: this.onRegistrationRequestReject.bind(this),
            },
        });
    }
    /**
     * Public method called from outside to accept incoming call.
     * @remarks
     */
    acceptCall(mediaRenderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mediaRenderer) {
                this.mediaStreamRendered = mediaRenderer;
            }
            // Call state must be in offer_received.
            if (this._callState === 'OFFER_RECEIVED' && this._opInProgress === core_typings_1.Operation.OP_PROCESS_INVITE) {
                this._callState = 'ANSWER_SENT';
                // Something is wrong, this session is not an instance of INVITE
                if (!(this.session instanceof sip_js_1.Invitation)) {
                    throw new Error('Session not instance of Invitation.');
                }
                /**
                 * It is important to decide when to add video option to the outgoing offer.
                 * This would matter when the reinvite goes out (In case of hold/unhold)
                 * This was added because there were failures in hold-unhold.
                 * The scenario was that if this client does hold-unhold first, and remote client does
                 * later, remote client goes in inconsistent state and hold-unhold does not work
                 * Where as if the remote client does hold-unhold first, this client can do it any number
                 * of times.
                 *
                 * Logic below works as follows
                 * Local video settings = true, incoming invite has video mline = false -> Any offer = audiovideo/ answer = audioonly
                 * Local video settings = true, incoming invite has video mline = true -> Any offer = audiovideo/ answer = audiovideo
                 * Local video settings = false, incoming invite has video mline = false -> Any offer = audioonly/ answer = audioonly
                 * Local video settings = false, incoming invite has video mline = true -> Any offer = audioonly/ answer = audioonly
                 *
                 */
                let videoInvite = !!this.config.enableVideo;
                const { body } = this.session;
                if (body && body.indexOf('m=video') === -1) {
                    videoInvite = false;
                }
                const invitationAcceptOptions = {
                    sessionDescriptionHandlerOptions: {
                        constraints: {
                            audio: true,
                            video: !!this.config.enableVideo && videoInvite,
                        },
                    },
                };
                return this.session.accept(invitationAcceptOptions);
            }
            throw new Error('Something went wrong');
        });
    }
    /* Helper routines for checking call actions BEGIN */
    canRejectCall() {
        return ['OFFER_RECEIVED', 'OFFER_SENT'].includes(this._callState);
    }
    canEndOrHoldCall() {
        return ['ANSWER_SENT', 'ANSWER_RECEIVED', 'IN_CALL', 'ON_HOLD', 'OFFER_SENT'].includes(this._callState);
    }
    /* Helper routines for checking call actions END */
    /**
     * Public method called from outside to reject a call.
     * @remarks
     */
    rejectCall() {
        if (!this.session) {
            throw new Error('Session does not exist.');
        }
        if (!this.canRejectCall()) {
            throw new Error(`Incorrect call State = ${this.callState}`);
        }
        if (!(this.session instanceof sip_js_1.Invitation)) {
            throw new Error('Session not instance of Invitation.');
        }
        return this.session.reject();
    }
    /**
     * Public method called from outside to end a call.
     * @remarks
     */
    endCall() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                throw new Error('Session does not exist.');
            }
            if (!this.canEndOrHoldCall()) {
                throw new Error(`Incorrect call State = ${this.callState}`);
            }
            // When call ends, force state to be revisited
            this.emit('stateChanged');
            switch (this.session.state) {
                case sip_js_1.SessionState.Initial:
                    if (this.session instanceof sip_js_1.Invitation) {
                        return this.session.reject();
                    }
                    throw new Error('Session not instance of Invitation.');
                case sip_js_1.SessionState.Establishing:
                    if (this.session instanceof sip_js_1.Invitation) {
                        return this.session.reject();
                    }
                    if (this.session instanceof sip_js_1.Inviter) {
                        return this.session.cancel();
                    }
                    throw new Error('Session not instance of Invitation.');
                case sip_js_1.SessionState.Established:
                    return this.session.bye();
                case sip_js_1.SessionState.Terminating:
                    break;
                case sip_js_1.SessionState.Terminated:
                    break;
                default:
                    throw new Error('Unknown state');
            }
        });
    }
    /**
     * Public method called from outside to mute the call.
     * @remarks
     */
    muteCall(muteState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                throw new Error('Session does not exist.');
            }
            if (this._callState !== 'IN_CALL') {
                throw new Error(`Incorrect call State = ${this.callState}`);
            }
            this.handleMuteUnmute(muteState);
        });
    }
    /**
     * Public method called from outside to hold the call.
     * @remarks
     */
    holdCall(holdState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                throw new Error('Session does not exist.');
            }
            if (!this.canEndOrHoldCall()) {
                throw new Error(`Incorrect call State = ${this.callState}`);
            }
            this.handleHoldUnhold(holdState);
        });
    }
    /* CallEventDelegate implementation end */
    isReady() {
        return this.state.isReady;
    }
    /**
     * This function allows to change the media renderer media elements.
     */
    switchMediaRenderer(mediaRenderer) {
        if (this.remoteStream) {
            this.mediaStreamRendered = mediaRenderer;
            this.remoteStream.init(mediaRenderer.remoteMediaElement);
            this.remoteStream.onTrackAdded(this.onTrackAdded.bind(this));
            this.remoteStream.onTrackRemoved(this.onTrackRemoved.bind(this));
            this.remoteStream.play();
        }
    }
    setWorkflowMode(mode) {
        this.mode = mode;
        if (mode === core_typings_1.WorkflowTypes.CONTACT_CENTER_USER) {
            this.queueInfo = new QueueAggregator_1.QueueAggregator();
        }
    }
    setMembershipSubscription(subscription) {
        var _a;
        if (this.mode !== core_typings_1.WorkflowTypes.CONTACT_CENTER_USER) {
            return;
        }
        (_a = this.queueInfo) === null || _a === void 0 ? void 0 : _a.setMembership(subscription);
    }
    getAggregator() {
        return this.queueInfo;
    }
    getRegistrarState() {
        var _a;
        return (_a = this.registerer) === null || _a === void 0 ? void 0 : _a.state.toString().toLocaleLowerCase();
    }
    clear() {
        var _a, _b;
        this._opInProgress = core_typings_1.Operation.OP_CLEANUP;
        /** Socket reconnection is attempted when the socket is disconnected with some error.
         * While disconnecting, if there is any socket error, there should be no reconnection attempt.
         * So when userAgent.stop() is called which closes the sockets, it should be made sure that
         * if the socket is disconnected with error, connection attempts are not started or
         * if there are any previously ongoing attempts, they should be terminated.
         * flag attemptReconnect is used for ensuring this.
         */
        this.stop = true;
        (_a = this.userAgent) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = this.registerer) === null || _b === void 0 ? void 0 : _b.dispose();
        this._connectionState = 'STOP';
        if (this.userAgent) {
            this.userAgent.transport.onConnect = undefined;
            this.userAgent.transport.onDisconnect = undefined;
            window.removeEventListener('online', this.onlineNetworkHandler);
            window.removeEventListener('offline', this.offlineNetworkHandler);
        }
    }
    onNetworkEvent(event, handler) {
        this.networkEmitter.on(event, handler);
    }
    offNetworkEvent(event, handler) {
        this.networkEmitter.off(event, handler);
    }
    /**
     * Connection is lost in 3 ways
     * 1. When local network is lost (Router is disconnected, switching networks, devtools->network->offline)
     * In this case, the SIP.js's transport layer does not detect the disconnection. Hence, it does not
     * call |onDisconnect|. To detect this kind of disconnection, window event listeners have been added.
     * These event listeners would be get called when the browser detects that network is offline or online.
     * When the network is restored, the code tries to reconnect. The useragent.transport "does not" generate the
     * onconnected event in this case as well. so onlineNetworkHandler calls attemptReconnection.
     * Which calls attemptRegistrationPostRecovery based on correct state. attemptRegistrationPostRecovery first tries to
     * unregister and then re-register.
     * Important note : We use the event listeners using bind function object offlineNetworkHandler and onlineNetworkHandler
     * It is done so because the same event handlers need to be used for removeEventListener, which becomes impossible
     * if done inline.
     *
     * 2. Computer goes to sleep. In this case onDisconnect is triggered. The code tries to reconnect but cant go ahead
     * as it goes to sleep. On waking up, The attemptReconnection gets executed, connection is completed.
     * In this case, it generates onConnected event. In this onConnected event it calls attemptRegistrationPostRecovery
     *
     * 3. When Asterisk disconnects all the endpoints either because it crashes or restarted,
     * As soon as the agent successfully connects to asterisk, it should re-register
     *
     * Retry count :
     * connectionRetryCount is the parameter called |Retry Count| in
     * Administration -> Call Center -> Server configuration -> Retry count.
     * The retry is implemented with backoff, maxbackoff = 8 seconds.
     * For continuous retries (In case Asterisk restart happens) Set this parameter to -1.
     *
     * Important to note is how attemptRegistrationPostRecovery is called. In case of
     * the router connection loss or while switching the networks,
     * there is no disconnect and connect event from the transport layer of the userAgent.
     * So in this case, when the connection is successful after reconnect, the code should try to re-register by calling
     * attemptRegistrationPostRecovery.
     * In case of computer waking from sleep or asterisk getting restored, connect and disconnect events are generated.
     * In this case, re-registration should be triggered (by calling) only when onConnected gets called and not otherwise.
     */
    attemptReconnection() {
        return __awaiter(this, arguments, void 0, function* (reconnectionAttempt = 0, checkRegistration = false) {
            const reconnectionAttempts = this.connectionRetryCount;
            this._connectionState = 'SERVER_RECONNECTING';
            if (!this.userAgent) {
                return;
            }
            if (this.stop) {
                return;
            }
            // reconnectionAttempts == -1 then keep continuously trying
            if (reconnectionAttempts !== -1 && reconnectionAttempt > reconnectionAttempts) {
                this._connectionState = 'ERROR';
                return;
            }
            const reconnectionDelay = Math.pow(2, reconnectionAttempt % 4);
            console.error(`Attempting to reconnect with backoff due to network loss. Backoff time [${reconnectionDelay}]`);
            setTimeout(() => {
                var _a;
                if (this.stop) {
                    return;
                }
                if (this._connectionState === 'SERVER_CONNECTED') {
                    return;
                }
                (_a = this.userAgent) === null || _a === void 0 ? void 0 : _a.reconnect().then(() => {
                    this._connectionState = 'SERVER_CONNECTED';
                }).catch(() => {
                    this.attemptReconnection(++reconnectionAttempt, checkRegistration);
                });
            }, reconnectionDelay * 1000);
        });
    }
    attemptPostRecoveryRoutine() {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * It might happen that the whole network loss can happen
             * while there is ongoing call. In that case, we want to maintain
             * the call.
             *
             * So after re-registration, it should remain in the same state.
             * */
            this.sendOptions({
                onAccept: () => {
                    this.attemptPostRecoveryRegistrationRoutine();
                },
                onReject: (error) => {
                    console.error(`[${error}] Failed to do options in attemptPostRecoveryRoutine()`);
                },
            });
        });
    }
    sendKeepAliveAndWaitForResponse() {
        return __awaiter(this, arguments, void 0, function* (withDebounce = false) {
            const promise = new Promise((resolve, reject) => {
                let keepAliveAccepted = false;
                let responseWaitTime = this.optionsKeepaliveInterval / 2;
                if (withDebounce) {
                    responseWaitTime += this.optionsKeepAliveDebounceTimeInSec;
                }
                this.sendOptions({
                    onAccept: () => {
                        keepAliveAccepted = true;
                    },
                    onReject: (_error) => {
                        console.error('Failed to do options.');
                    },
                });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (!keepAliveAccepted) {
                        reject(false);
                    }
                    else {
                        if (this.attemptRegistration) {
                            this.attemptPostRecoveryRoutine();
                            this.attemptRegistration = false;
                        }
                        resolve(true);
                    }
                }), responseWaitTime * 1000);
            });
            return promise;
        });
    }
    startOptionsPingForUnstableNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.userAgent || this.stop) {
                    return;
                }
                if (this._connectionState !== 'SERVER_RECONNECTING') {
                    let isConnected = false;
                    try {
                        yield this.sendKeepAliveAndWaitForResponse();
                        isConnected = true;
                    }
                    catch (e) {
                        console.error(`[${e}] Failed to do options ping.`);
                    }
                    finally {
                        // Send event only if it's a "change" on the status (avoid unnecessary event flooding)
                        !isConnected && this.networkEmitter.emit('disconnected');
                        isConnected && this.networkEmitter.emit('connected');
                    }
                }
                // Each seconds check if the network can reach asterisk. If not, try to reconnect
                this.startOptionsPingForUnstableNetworks();
            }), this.optionsKeepaliveInterval * 1000);
        });
    }
    attemptPostRecoveryRegistrationRoutine() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            /**
             * It might happen that the whole network loss can happen
             * while there is ongoing call. In that case, we want to maintain
             * the call.
             *
             * So after re-registration, it should remain in the same state.
             * */
            const promise = new Promise((_resolve, _reject) => {
                var _a;
                (_a = this.registerer) === null || _a === void 0 ? void 0 : _a.unregister({
                    all: true,
                    requestDelegate: {
                        onAccept: () => {
                            _resolve();
                        },
                        onReject: (error) => {
                            console.error(`[${error}] While unregistering after recovery`);
                            this.emit('unregistrationerror', error);
                            _reject('Error in Unregistering');
                        },
                    },
                });
            });
            try {
                yield promise;
            }
            catch (error) {
                console.error(`[${error}] While waiting for unregister promise`);
            }
            (_a = this.registerer) === null || _a === void 0 ? void 0 : _a.register({
                requestDelegate: {
                    onReject: (error) => {
                        this._callState = 'UNREGISTERED';
                        this.emit('registrationerror', error);
                        this.emit('stateChanged');
                    },
                },
            });
        });
    }
    changeAudioInputDevice(constraints) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.session) {
                console.warn('changeAudioInputDevice() : No session. Returning');
                return false;
            }
            const newStream = yield LocalStream_1.default.requestNewStream(constraints, this.session);
            if (!newStream) {
                console.warn('changeAudioInputDevice() : Unable to get local stream. Returning');
                return false;
            }
            const { peerConnection } = (_a = this.session) === null || _a === void 0 ? void 0 : _a.sessionDescriptionHandler;
            if (!peerConnection) {
                console.warn('changeAudioInputDevice() : No peer connection. Returning');
                return false;
            }
            LocalStream_1.default.replaceTrack(peerConnection, newStream, 'audio');
            return true;
        });
    }
    // Commenting this as Video Configuration is not part of the scope for now
    // async changeVideoInputDevice(selectedVideoDevices: IDevice): Promise<boolean> {
    // 	if (!this.session) {
    // 		console.warn('changeVideoInputDevice() : No session. Returning');
    // 		return false;
    // 	}
    // 	if (!this.config.enableVideo || this.deviceManager.hasVideoInputDevice()) {
    // 		console.warn('changeVideoInputDevice() : Unable change video device. Returning');
    // 		return false;
    // 	}
    // 	this.deviceManager.changeVideoInputDevice(selectedVideoDevices);
    // 	const newStream = await LocalStream.requestNewStream(this.deviceManager.getConstraints('video'), this.session);
    // 	if (!newStream) {
    // 		console.warn('changeVideoInputDevice() : Unable to get local stream. Returning');
    // 		return false;
    // 	}
    // 	const { peerConnection } = this.session?.sessionDescriptionHandler as SessionDescriptionHandler;
    // 	if (!peerConnection) {
    // 		console.warn('changeVideoInputDevice() : No peer connection. Returning');
    // 		return false;
    // 	}
    // 	LocalStream.replaceTrack(peerConnection, newStream, 'video');
    // 	return true;
    // }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    makeCallURI(_callee, _mediaRenderer) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    makeCall(_calleeNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
}
exports.VoIPUser = VoIPUser;
