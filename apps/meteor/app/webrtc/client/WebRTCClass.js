"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTC = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const meteor_1 = require("meteor/meteor");
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const screenShare_1 = require("./screenShare");
const GenericModal_1 = __importDefault(require("../../../client/components/GenericModal"));
const imperativeModal_1 = require("../../../client/lib/imperativeModal");
const goToRoomById_1 = require("../../../client/lib/utils/goToRoomById");
const client_1 = require("../../models/client");
const client_2 = require("../../settings/client");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const i18n_1 = require("../../utils/lib/i18n");
const constants_1 = require("../lib/constants");
class WebRTCTransportClass extends emitter_1.Emitter {
    constructor(webrtcInstance) {
        super();
        this.webrtcInstance = webrtcInstance;
        this.debug = false;
        SDKClient_1.sdk.stream('notify-room', [`${this.webrtcInstance.room}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`], (type, data) => {
            this.log('WebRTCTransportClass - onRoom', type, data);
            this.emit(type, data);
        });
    }
    log(...args) {
        if (this.debug === true) {
            console.log(...args);
        }
    }
    onUserStream(...[type, data]) {
        if (data.room !== this.webrtcInstance.room) {
            return;
        }
        this.log('WebRTCTransportClass - onUser', type, data);
        switch (type) {
            case 'candidate':
                this.emit('candidate', data);
                break;
            case 'description':
                this.emit('description', data);
                break;
            case 'join':
                this.emit('join', data);
                break;
        }
    }
    startCall(data) {
        this.log('WebRTCTransportClass - startCall', this.webrtcInstance.room, this.webrtcInstance.selfId);
        SDKClient_1.sdk.publish('notify-room-users', [
            `${this.webrtcInstance.room}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
            constants_1.WEB_RTC_EVENTS.CALL,
            {
                from: this.webrtcInstance.selfId,
                room: this.webrtcInstance.room,
                media: data.media,
                monitor: data.monitor,
            },
        ]);
    }
    joinCall(data) {
        this.log('WebRTCTransportClass - joinCall', this.webrtcInstance.room, this.webrtcInstance.selfId);
        if (data.monitor === true) {
            SDKClient_1.sdk.publish('notify-user', [
                `${data.to}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
                constants_1.WEB_RTC_EVENTS.JOIN,
                {
                    from: this.webrtcInstance.selfId,
                    room: this.webrtcInstance.room,
                    media: data.media,
                    monitor: data.monitor,
                },
            ]);
        }
        else {
            SDKClient_1.sdk.publish('notify-room-users', [
                `${this.webrtcInstance.room}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`,
                constants_1.WEB_RTC_EVENTS.JOIN,
                {
                    from: this.webrtcInstance.selfId,
                    room: this.webrtcInstance.room,
                    media: data.media,
                    monitor: data.monitor,
                },
            ]);
        }
    }
    sendCandidate(data) {
        data.from = this.webrtcInstance.selfId;
        data.room = this.webrtcInstance.room;
        this.log('WebRTCTransportClass - sendCandidate', data);
        SDKClient_1.sdk.publish('notify-user', [`${data.to}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, constants_1.WEB_RTC_EVENTS.CANDIDATE, data]);
    }
    sendDescription(data) {
        data.from = this.webrtcInstance.selfId;
        data.room = this.webrtcInstance.room;
        this.log('WebRTCTransportClass - sendDescription', data);
        SDKClient_1.sdk.publish('notify-user', [`${data.to}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, constants_1.WEB_RTC_EVENTS.DESCRIPTION, data]);
    }
    sendStatus(data) {
        this.log('WebRTCTransportClass - sendStatus', data, this.webrtcInstance.room);
        data.from = this.webrtcInstance.selfId;
        SDKClient_1.sdk.publish('notify-room', [`${this.webrtcInstance.room}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`, constants_1.WEB_RTC_EVENTS.STATUS, data]);
    }
    onRemoteCall(fn) {
        return this.on(constants_1.WEB_RTC_EVENTS.CALL, fn);
    }
    onRemoteJoin(fn) {
        return this.on(constants_1.WEB_RTC_EVENTS.JOIN, fn);
    }
    onRemoteCandidate(fn) {
        return this.on(constants_1.WEB_RTC_EVENTS.CANDIDATE, fn);
    }
    onRemoteDescription(fn) {
        return this.on(constants_1.WEB_RTC_EVENTS.DESCRIPTION, fn);
    }
    onRemoteStatus(fn) {
        return this.on(constants_1.WEB_RTC_EVENTS.STATUS, fn);
    }
}
class WebRTCClass {
    constructor(selfId, room, autoAccept = false) {
        this.selfId = selfId;
        this.room = room;
        this.autoAccept = autoAccept;
        this.peerConnections = {};
        this.resetCallInProgress = () => {
            this.callInProgress.set(false);
        };
        this.callInProgressTimeout = undefined;
        this.stopPeerConnection = (id) => {
            const peerConnection = this.peerConnections[id];
            if (peerConnection == null) {
                return;
            }
            delete this.peerConnections[id];
            peerConnection.close();
            this.updateRemoteItems();
        };
        this.config = {
            iceServers: [],
        };
        this.debug = false;
        this.TransportClass = WebRTCTransportClass;
        let servers = client_2.settings.get('WebRTC_Servers');
        if (servers && servers.trim() !== '') {
            servers = servers.replace(/\s/g, '');
            servers.split(',').forEach((server) => {
                const parts = server.split('@');
                const serverConfig = {
                    urls: parts.pop(),
                };
                if (parts.length === 1) {
                    const [username, credential] = parts[0].split(':');
                    serverConfig.username = decodeURIComponent(username);
                    serverConfig.credential = decodeURIComponent(credential);
                }
                this.config.iceServers.push(serverConfig);
            });
        }
        this.peerConnections = {};
        this.remoteItems = new reactive_var_1.ReactiveVar([]);
        this.remoteItemsById = new reactive_var_1.ReactiveVar({});
        this.callInProgress = new reactive_var_1.ReactiveVar(false);
        this.audioEnabled = new reactive_var_1.ReactiveVar(false);
        this.videoEnabled = new reactive_var_1.ReactiveVar(false);
        this.overlayEnabled = new reactive_var_1.ReactiveVar(false);
        this.screenShareEnabled = new reactive_var_1.ReactiveVar(false);
        this.localUrl = new reactive_var_1.ReactiveVar(undefined);
        this.active = false;
        this.remoteMonitoring = false;
        this.monitor = false;
        this.navigator = undefined;
        const userAgent = navigator.userAgent.toLocaleLowerCase();
        if (userAgent.indexOf('electron') !== -1) {
            this.navigator = 'electron';
        }
        else if (userAgent.indexOf('chrome') !== -1) {
            this.navigator = 'chrome';
        }
        else if (userAgent.indexOf('firefox') !== -1) {
            this.navigator = 'firefox';
        }
        else if (userAgent.indexOf('safari') !== -1) {
            this.navigator = 'safari';
        }
        this.screenShareAvailable = ['chrome', 'firefox', 'electron'].includes(this.navigator);
        this.media = {
            video: true,
            audio: true,
        };
        this.transport = new this.TransportClass(this);
        this.transport.onRemoteCall(this.onRemoteCall.bind(this));
        this.transport.onRemoteJoin(this.onRemoteJoin.bind(this));
        this.transport.onRemoteCandidate(this.onRemoteCandidate.bind(this));
        this.transport.onRemoteDescription(this.onRemoteDescription.bind(this));
        this.transport.onRemoteStatus(this.onRemoteStatus.bind(this));
        setInterval(this.checkPeerConnections.bind(this), 1000);
    }
    onUserStream(...[type, data]) {
        switch (type) {
            case 'candidate':
                this.transport.onUserStream('candidate', data);
                break;
            case 'description':
                this.transport.onUserStream('description', data);
                break;
            case 'join':
                this.transport.onUserStream('join', data);
                break;
        }
    }
    log(...args) {
        if (this.debug === true) {
            console.log(...args);
        }
    }
    onError(...args) {
        console.error(...args);
    }
    checkPeerConnections() {
        const { peerConnections } = this;
        const date = Date.now();
        Object.entries(peerConnections).some(([id, peerConnection]) => {
            if (!['connected', 'completed'].includes(peerConnection.iceConnectionState) && peerConnection.createdAt + 5000 < date) {
                this.stopPeerConnection(id);
                return true;
            }
            return false;
        });
    }
    updateRemoteItems() {
        const items = [];
        const itemsById = {};
        const { peerConnections } = this;
        Object.entries(peerConnections).forEach(([id, peerConnection]) => {
            peerConnection.getRemoteStreams().forEach((remoteStream) => {
                const item = {
                    id,
                    url: remoteStream,
                    state: peerConnection.iceConnectionState,
                };
                switch (peerConnection.iceConnectionState) {
                    case 'checking':
                        item.stateText = 'Connecting...';
                        break;
                    case 'connected':
                    case 'completed':
                        item.stateText = 'Connected';
                        item.connected = true;
                        break;
                    case 'disconnected':
                        item.stateText = 'Disconnected';
                        break;
                    case 'failed':
                        item.stateText = 'Failed';
                        break;
                    case 'closed':
                        item.stateText = 'Closed';
                }
                items.push(item);
                itemsById[id] = item;
            });
        });
        this.remoteItems.set(items);
        this.remoteItemsById.set(itemsById);
    }
    broadcastStatus() {
        if (this.active !== true || this.monitor === true || this.remoteMonitoring === true) {
            return;
        }
        const remoteConnections = [];
        const { peerConnections } = this;
        Object.entries(peerConnections).forEach(([id, { remoteMedia: media }]) => {
            remoteConnections.push({
                id,
                media,
            });
        });
        this.transport.sendStatus({
            media: this.media,
            remoteConnections,
        });
    }
    onRemoteStatus(data) {
        // this.log(onRemoteStatus, arguments);
        this.callInProgress.set(true);
        clearTimeout(this.callInProgressTimeout);
        this.callInProgressTimeout = setTimeout(this.resetCallInProgress, 2000);
        if (this.active !== true) {
            return;
        }
        const remoteConnections = [
            {
                id: data.from,
                media: data.media,
            },
            ...data.remoteConnections,
        ];
        remoteConnections.forEach((remoteConnection) => {
            if (remoteConnection.id !== this.selfId && this.peerConnections[remoteConnection.id] == null) {
                this.log('reconnecting with', remoteConnection.id);
                this.onRemoteJoin({
                    from: remoteConnection.id,
                    media: remoteConnection.media,
                });
            }
        });
    }
    getPeerConnection(id) {
        if (this.peerConnections[id] != null) {
            return this.peerConnections[id];
        }
        const peerConnection = new RTCPeerConnection(this.config);
        peerConnection.createdAt = Date.now();
        peerConnection.remoteMedia = {};
        this.peerConnections[id] = peerConnection;
        const eventNames = [
            'icecandidate',
            'addstream',
            'removestream',
            'iceconnectionstatechange',
            'datachannel',
            'identityresult',
            'idpassertionerror',
            'idpvalidationerror',
            'negotiationneeded',
            'peeridentity',
            'signalingstatechange',
        ];
        eventNames.forEach((eventName) => {
            peerConnection.addEventListener(eventName, (e) => {
                this.log(id, e.type, e);
            });
        });
        peerConnection.addEventListener('icecandidate', (e) => {
            if (e.candidate == null) {
                return;
            }
            this.transport.sendCandidate({
                to: id,
                candidate: {
                    candidate: e.candidate.candidate,
                    sdpMLineIndex: e.candidate.sdpMLineIndex,
                    sdpMid: e.candidate.sdpMid,
                },
            });
        });
        peerConnection.addEventListener('addstream', () => {
            this.updateRemoteItems();
        });
        peerConnection.addEventListener('removestream', () => {
            this.updateRemoteItems();
        });
        peerConnection.addEventListener('iceconnectionstatechange', () => {
            if ((peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'closed') &&
                peerConnection === this.peerConnections[id]) {
                this.stopPeerConnection(id);
                setTimeout(() => {
                    if (Object.keys(this.peerConnections).length === 0) {
                        this.stop();
                    }
                }, 3000);
            }
            this.updateRemoteItems();
        });
        return peerConnection;
    }
    _getUserMedia(media, onSuccess, onError) {
        var _a, _b;
        const onSuccessLocal = (stream) => {
            if (AudioContext && stream.getAudioTracks().length > 0) {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const volume = audioContext.createGain();
                source.connect(volume);
                const peer = audioContext.createMediaStreamDestination();
                volume.connect(peer);
                volume.gain.value = 0.6;
                stream.removeTrack(stream.getAudioTracks()[0]);
                stream.addTrack(peer.stream.getAudioTracks()[0]);
                stream.volume = volume;
                this.audioContext = audioContext;
            }
            onSuccess(stream);
        };
        if ((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(media).then(onSuccessLocal).catch(onError);
        }
        (_b = navigator.getUserMedia) === null || _b === void 0 ? void 0 : _b.call(navigator, media, onSuccessLocal, onError);
    }
    getUserMedia(media, onSuccess, onError = this.onError) {
        if (media.desktop !== true) {
            void this._getUserMedia(media, onSuccess, onError);
            return;
        }
        if (this.screenShareAvailable !== true) {
            console.log('Screen share is not avaliable');
            return;
        }
        const getScreen = (audioStream) => {
            const refresh = function () {
                imperativeModal_1.imperativeModal.open({
                    component: GenericModal_1.default,
                    props: {
                        variant: 'warning',
                        title: (0, i18n_1.t)('Refresh_your_page_after_install_to_enable_screen_sharing'),
                    },
                });
            };
            const isChromeExtensionInstalled = this.navigator === 'chrome' && screenShare_1.ChromeScreenShare.installed;
            const isFirefoxExtensionInstalled = this.navigator === 'firefox' && window.rocketchatscreenshare != null;
            if (!isChromeExtensionInstalled && !isFirefoxExtensionInstalled) {
                imperativeModal_1.imperativeModal.open({
                    component: GenericModal_1.default,
                    props: {
                        title: (0, i18n_1.t)('Screen_Share'),
                        variant: 'warning',
                        confirmText: (0, i18n_1.t)('Install_Extension'),
                        cancelText: (0, i18n_1.t)('Cancel'),
                        children: (0, i18n_1.t)('You_need_install_an_extension_to_allow_screen_sharing'),
                        onConfirm: () => {
                            if (this.navigator === 'chrome') {
                                const url = 'https://chrome.google.com/webstore/detail/rocketchat-screen-share/nocfbnnmjnndkbipkabodnheejiegccf';
                                try {
                                    chrome.webstore.install(url, refresh, () => {
                                        window.open(url);
                                        refresh();
                                    });
                                }
                                catch (_error) {
                                    console.log(_error);
                                    window.open(url);
                                    refresh();
                                }
                            }
                            else if (this.navigator === 'firefox') {
                                window.open('https://addons.mozilla.org/en-GB/firefox/addon/rocketchat-screen-share/');
                                refresh();
                            }
                        },
                    },
                });
                return onError(false);
            }
            const getScreenSuccess = (stream) => {
                if (audioStream != null) {
                    stream.addTrack(audioStream.getAudioTracks()[0]);
                }
                onSuccess(stream);
            };
            if (this.navigator === 'firefox') {
                media = {
                    audio: media.audio,
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window',
                    },
                };
                void this._getUserMedia(media, getScreenSuccess, onError);
            }
            else {
                screenShare_1.ChromeScreenShare.getSourceId(this.navigator, (id) => {
                    media = {
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: id,
                                maxWidth: 1280,
                                maxHeight: 720,
                            },
                        },
                    };
                    void this._getUserMedia(media, getScreenSuccess, onError);
                });
            }
        };
        if (this.navigator === 'firefox' || media.audio == null || media.audio === false) {
            getScreen();
        }
        else {
            const getAudioSuccess = (audioStream) => {
                getScreen(audioStream);
            };
            const getAudioError = () => {
                getScreen();
            };
            void this._getUserMedia({
                audio: media.audio,
            }, getAudioSuccess, getAudioError);
        }
    }
    getLocalUserMedia(callback, ...args) {
        this.log('getLocalUserMedia', [callback, ...args]);
        if (this.localStream != null) {
            return callback(null, this.localStream);
        }
        const onSuccess = (stream) => {
            this.localStream = stream;
            !this.audioEnabled.get() && this.disableAudio();
            !this.videoEnabled.get() && this.disableVideo();
            this.localUrl.set(stream);
            const { peerConnections } = this;
            Object.entries(peerConnections).forEach(([, peerConnection]) => peerConnection.addStream(stream));
            document.querySelector('video#localVideo').srcObject = stream;
            callback(null, this.localStream);
        };
        const onError = (error) => {
            callback(false);
            this.onError(error);
        };
        this.getUserMedia(this.media, onSuccess, onError);
    }
    stopAllPeerConnections() {
        var _a;
        const { peerConnections } = this;
        Object.keys(peerConnections).forEach(this.stopPeerConnection);
        void ((_a = window.audioContext) === null || _a === void 0 ? void 0 : _a.close()); // FIXME: probably should be `this.audioContext`
    }
    setAudioEnabled(enabled = true) {
        if (this.localStream != null) {
            this.localStream.getAudioTracks().forEach((audio) => {
                audio.enabled = enabled;
            });
            this.audioEnabled.set(enabled);
        }
    }
    disableAudio() {
        this.setAudioEnabled(false);
    }
    enableAudio() {
        this.setAudioEnabled(true);
    }
    toggleAudio() {
        if (this.audioEnabled.get()) {
            return this.disableAudio();
        }
        return this.enableAudio();
    }
    setVideoEnabled(enabled = true) {
        if (this.localStream != null) {
            this.localStream.getVideoTracks().forEach((video) => {
                video.enabled = enabled;
            });
            this.videoEnabled.set(enabled);
        }
    }
    disableScreenShare() {
        this.setScreenShareEnabled(false);
    }
    enableScreenShare() {
        this.setScreenShareEnabled(true);
    }
    setScreenShareEnabled(enabled = true) {
        if (this.localStream != null) {
            this.media.desktop = enabled;
            delete this.localStream;
            this.getLocalUserMedia((err) => {
                if (err != null) {
                    return;
                }
                this.screenShareEnabled.set(enabled);
                this.stopAllPeerConnections();
                this.joinCall();
            });
        }
    }
    disableVideo() {
        this.setVideoEnabled(false);
    }
    enableVideo() {
        this.setVideoEnabled(true);
    }
    toggleVideo() {
        if (this.videoEnabled.get()) {
            return this.disableVideo();
        }
        return this.enableVideo();
    }
    stop() {
        this.active = false;
        this.monitor = false;
        this.remoteMonitoring = false;
        if (this.localStream != null && typeof this.localStream !== 'undefined') {
            this.localStream.getTracks().forEach((track) => track.stop());
        }
        this.localUrl.set(undefined);
        delete this.localStream;
        this.stopAllPeerConnections();
    }
    startCall(media = {}, ...args) {
        this.log('startCall', [media, ...args]);
        this.media = media;
        this.getLocalUserMedia(() => {
            this.active = true;
            this.transport.startCall({
                media: this.media,
            });
        });
    }
    startCallAsMonitor(media = {}, ...args) {
        this.log('startCallAsMonitor', [media, ...args]);
        this.media = media;
        this.active = true;
        this.monitor = true;
        this.transport.startCall({
            media: this.media,
            monitor: true,
        });
    }
    onRemoteCall(data) {
        var _a, _b;
        if (this.autoAccept === true) {
            setTimeout(() => {
                this.joinCall({
                    to: data.from,
                    monitor: data.monitor,
                    media: data.media,
                });
            }, 0);
            return;
        }
        const user = meteor_1.Meteor.users.findOne(data.from);
        let fromUsername = undefined;
        if (user === null || user === void 0 ? void 0 : user.username) {
            fromUsername = user.username;
        }
        const subscription = client_1.Subscriptions.findOne({
            rid: data.room,
        });
        let icon;
        let title;
        if (data.monitor === true) {
            icon = 'eye';
            title = (0, i18n_1.t)('WebRTC_monitor_call_from_%s', fromUsername);
        }
        else if (subscription && subscription.t === 'd') {
            if ((_a = data.media) === null || _a === void 0 ? void 0 : _a.video) {
                icon = 'video';
                title = (0, i18n_1.t)('WebRTC_direct_video_call_from_%s', fromUsername);
            }
            else {
                icon = 'phone';
                title = (0, i18n_1.t)('WebRTC_direct_audio_call_from_%s', fromUsername);
            }
        }
        else if ((_b = data.media) === null || _b === void 0 ? void 0 : _b.video) {
            icon = 'video';
            title = (0, i18n_1.t)('WebRTC_group_video_call_from_%s', subscription.name);
        }
        else {
            icon = 'phone';
            title = (0, i18n_1.t)('WebRTC_group_audio_call_from_%s', subscription.name);
        }
        imperativeModal_1.imperativeModal.open({
            component: GenericModal_1.default,
            props: {
                title,
                icon,
                confirmText: (0, i18n_1.t)('Yes'),
                cancelText: (0, i18n_1.t)('No'),
                children: (0, i18n_1.t)('Do_you_want_to_accept'),
                onConfirm: () => {
                    void (0, goToRoomById_1.goToRoomById)(data.room);
                    return this.joinCall({
                        to: data.from,
                        monitor: data.monitor,
                        media: data.media,
                    });
                },
                onCancel: () => this.stop(),
                onClose: () => this.stop(),
            },
        });
    }
    joinCall(data = {}, ...args) {
        data.media = this.media;
        this.log('joinCall', [data, ...args]);
        this.getLocalUserMedia(() => {
            this.remoteMonitoring = data.monitor;
            this.active = true;
            this.transport.joinCall(data);
        });
    }
    onRemoteJoin(data, ...args) {
        var _a, _b;
        if (this.active !== true) {
            return;
        }
        this.log('onRemoteJoin', [data, ...args]);
        let peerConnection = this.getPeerConnection(data.from);
        // needsRefresh = false
        // if peerConnection.iceConnectionState isnt 'new'
        // needsAudio = data.media.audio is true and peerConnection.remoteMedia.audio isnt true
        // needsVideo = data.media.video is true and peerConnection.remoteMedia.video isnt true
        // needsRefresh = needsAudio or needsVideo or data.media.desktop isnt peerConnection.remoteMedia.desktop
        // # if peerConnection.signalingState is "have-local-offer" or needsRefresh
        if (peerConnection.signalingState !== 'checking') {
            this.stopPeerConnection(data.from);
            peerConnection = this.getPeerConnection(data.from);
        }
        if (peerConnection.iceConnectionState !== 'new') {
            return;
        }
        peerConnection.remoteMedia = data.media;
        if (this.localStream) {
            peerConnection.addStream(this.localStream);
        }
        const onOffer = (offer) => {
            const onLocalDescription = () => {
                this.transport.sendDescription({
                    to: data.from,
                    type: 'offer',
                    ts: peerConnection.createdAt,
                    media: this.media,
                    description: {
                        sdp: offer.sdp,
                        type: offer.type,
                    },
                });
            };
            void peerConnection.setLocalDescription(new RTCSessionDescription(offer), onLocalDescription, this.onError);
        };
        if (data.monitor === true) {
            void peerConnection.createOffer(onOffer, this.onError, {
                mandatory: {
                    OfferToReceiveAudio: (_a = data.media) === null || _a === void 0 ? void 0 : _a.audio,
                    OfferToReceiveVideo: (_b = data.media) === null || _b === void 0 ? void 0 : _b.video,
                },
            });
        }
        else {
            void peerConnection.createOffer(onOffer, this.onError);
        }
    }
    onRemoteOffer(data, ...args) {
        if (this.active !== true) {
            return;
        }
        this.log('onRemoteOffer', [data, ...args]);
        let peerConnection = this.getPeerConnection(data.from);
        if (['have-local-offer', 'stable'].includes(peerConnection.signalingState) && peerConnection.createdAt < data.ts) {
            this.stopPeerConnection(data.from);
            peerConnection = this.getPeerConnection(data.from);
        }
        if (peerConnection.iceConnectionState !== 'new') {
            return;
        }
        void peerConnection.setRemoteDescription(new RTCSessionDescription(data.description));
        try {
            if (this.localStream) {
                peerConnection.addStream(this.localStream);
            }
        }
        catch (error) {
            console.log(error);
        }
        const onAnswer = (answer) => {
            const onLocalDescription = () => {
                this.transport.sendDescription({
                    to: data.from,
                    type: 'answer',
                    ts: peerConnection.createdAt,
                    description: {
                        sdp: answer.sdp,
                        type: answer.type,
                    },
                });
            };
            void peerConnection.setLocalDescription(new RTCSessionDescription(answer), onLocalDescription, this.onError);
        };
        void peerConnection.createAnswer(onAnswer, this.onError);
    }
    onRemoteCandidate(data, ...args) {
        var _a;
        if (this.active !== true) {
            return;
        }
        if (data.to !== this.selfId) {
            return;
        }
        this.log('onRemoteCandidate', [data, ...args]);
        const peerConnection = this.getPeerConnection(data.from);
        if (peerConnection.iceConnectionState !== 'closed' &&
            peerConnection.iceConnectionState !== 'failed' &&
            peerConnection.iceConnectionState !== 'disconnected' &&
            peerConnection.iceConnectionState !== 'completed') {
            void peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        document.querySelector('video#remoteVideo').srcObject = (_a = this.remoteItems.get()[0]) === null || _a === void 0 ? void 0 : _a.url;
    }
    onRemoteDescription(data, ...args) {
        if (this.active !== true) {
            return;
        }
        if (data.to !== this.selfId) {
            return;
        }
        this.log('onRemoteDescription', [data, ...args]);
        const peerConnection = this.getPeerConnection(data.from);
        if (data.type === 'offer') {
            peerConnection.remoteMedia = data.media;
            this.onRemoteOffer({
                from: data.from,
                ts: data.ts,
                description: data.description,
            });
        }
        else {
            void peerConnection.setRemoteDescription(new RTCSessionDescription(data.description));
        }
    }
}
const WebRTC = new (class {
    constructor() {
        this.instancesByRoomId = {};
        this.instancesByRoomId = {};
    }
    getInstanceByRoomId(rid, visitorId = null) {
        let enabled = false;
        if (!visitorId) {
            const subscription = client_1.Subscriptions.findOne({ rid });
            if (!subscription) {
                return;
            }
            switch (subscription.t) {
                case 'd':
                    enabled = client_2.settings.get('WebRTC_Enable_Direct');
                    break;
                case 'p':
                    enabled = client_2.settings.get('WebRTC_Enable_Private');
                    break;
                case 'c':
                    enabled = client_2.settings.get('WebRTC_Enable_Channel');
                    break;
                case 'l':
                    enabled = client_2.settings.get('Omnichannel_call_provider') === 'WebRTC';
            }
        }
        else {
            enabled = client_2.settings.get('Omnichannel_call_provider') === 'WebRTC';
        }
        enabled = enabled && client_2.settings.get('WebRTC_Enabled');
        if (enabled === false) {
            return;
        }
        if (this.instancesByRoomId[rid] == null) {
            let uid = meteor_1.Meteor.userId();
            let autoAccept = false;
            if (visitorId) {
                uid = visitorId;
                autoAccept = true;
            }
            this.instancesByRoomId[rid] = new WebRTCClass(uid, rid, autoAccept);
        }
        return this.instancesByRoomId[rid];
    }
})();
exports.WebRTC = WebRTC;
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const uid = meteor_1.Meteor.userId();
        if (uid) {
            SDKClient_1.sdk.stream('notify-user', [`${uid}/${constants_1.WEB_RTC_EVENTS.WEB_RTC}`], (type, data) => {
                if (data.room == null) {
                    return;
                }
                const webrtc = WebRTC.getInstanceByRoomId(data.room);
                switch (type) {
                    case 'candidate':
                        webrtc === null || webrtc === void 0 ? void 0 : webrtc.onUserStream('candidate', data);
                        break;
                    case 'description':
                        webrtc === null || webrtc === void 0 ? void 0 : webrtc.onUserStream('description', data);
                        break;
                    case 'join':
                        webrtc === null || webrtc === void 0 ? void 0 : webrtc.onUserStream('join', data);
                        break;
                }
            });
        }
    });
});
