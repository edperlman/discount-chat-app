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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConfManager = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const getConfig_1 = require("./utils/getConfig");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const debug = !!((0, getConfig_1.getConfig)('debug') || (0, getConfig_1.getConfig)('debug-VideoConf'));
// The interval between attempts to call the remote user
const CALL_INTERVAL = 3000;
// How many attempts to call we're gonna make
const CALL_ATTEMPT_LIMIT = 10;
// The amount of time we'll assume an incoming call is still valid without any updates from the remote user
const CALL_TIMEOUT = 10000;
// How long are we gonna wait for a link after accepting an incoming call
const ACCEPT_TIMEOUT = 5000;
exports.VideoConfManager = new (class VideoConfManager extends emitter_1.Emitter {
    get preferences() {
        return this._preferences;
    }
    get capabilities() {
        return this._capabilities;
    }
    constructor() {
        super();
        this.startingNewCall = false;
        this.hooks = [];
        this.directCalls = [];
        this.incomingDirectCalls = new Map();
        this.dismissedCalls = new Set();
        this._preferences = { mic: true, cam: false };
        this._capabilities = {};
        this.on('incoming/changed', () => {
            this.directCalls = [...this.incomingDirectCalls.values()]
                // Filter out any calls that we're in the process of accepting, so they're already hidden from the UI
                .filter((call) => !call.acceptTimeout)
                .map((_a) => {
                var { timeout: _, acceptTimeout: _t } = _a, call = __rest(_a, ["timeout", "acceptTimeout"]);
                return (Object.assign(Object.assign({}, call), { dismissed: this.isCallDismissed(call.callId) }));
            });
        });
    }
    isBusy() {
        if (this.startingNewCall) {
            return true;
        }
        return this.isCalling();
    }
    isRinging() {
        return [...this.incomingDirectCalls.values()].some(({ callId }) => !this.isCallDismissed(callId));
    }
    isCalling() {
        if (this.currentCallHandler || (this.currentCallData && !this.currentCallData.joined)) {
            return true;
        }
        return false;
    }
    getIncomingDirectCalls() {
        return this.directCalls;
    }
    startCall(roomId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId || this.isBusy()) {
                throw new Error('Video manager is busy.');
            }
            debug && console.log(`[VideoConf] Starting new call on room ${roomId}`);
            this.startingNewCall = true;
            this.emit('calling/changed');
            const { data } = yield SDKClient_1.sdk.rest.post('/v1/video-conference.start', { roomId, title, allowRinging: true }).catch((e) => {
                var _a, _b;
                debug && console.error(`[VideoConf] Failed to start new call on room ${roomId}`);
                this.startingNewCall = false;
                this.emit('calling/changed');
                this.emit('start/error', { error: ((_b = (_a = e === null || e === void 0 ? void 0 : e.xhr) === null || _a === void 0 ? void 0 : _a.responseJSON) === null || _b === void 0 ? void 0 : _b.error) || 'unknown-error' });
                return Promise.reject(e);
            });
            this.startingNewCall = false;
            this.emit('calling/changed');
            if (data.type !== 'direct') {
                this.emit('calling/ended');
            }
            switch (data.type) {
                case 'direct':
                    return this.callUser({ uid: data.calleeId, rid: roomId, callId: data.callId });
                case 'videoconference':
                    return this.joinCall(data.callId);
                case 'livechat':
                    return this.joinCall(data.callId);
            }
        });
    }
    acceptIncomingCall(callId) {
        const callData = this.incomingDirectCalls.get(callId);
        if (!callData) {
            throw new Error('Unable to find accepted call information.');
        }
        if (callData.acceptTimeout) {
            debug && console.log(`[VideoConf] We're already trying to accept call ${callId}.`);
            return;
        }
        debug && console.log(`[VideoConf] Accepting incoming call ${callId}.`);
        if (callData.timeout) {
            clearTimeout(callData.timeout);
            this.setIncomingCallAttribute(callId, 'timeout', undefined);
        }
        // Mute this call Id so any lingering notifications don't trigger it again
        this.dismissIncomingCall(callId);
        this.setIncomingCallAttribute(callId, 'acceptTimeout', setTimeout(() => {
            const updatedCallData = this.incomingDirectCalls.get(callId);
            if (!(updatedCallData === null || updatedCallData === void 0 ? void 0 : updatedCallData.acceptTimeout)) {
                return;
            }
            debug && console.log(`[VideoConf] Attempt to accept call has timed out.`);
            this.removeIncomingCall(callId);
            this.emit('direct/failed', { callId, uid: callData.uid, rid: callData.rid });
        }, ACCEPT_TIMEOUT));
        this.emit('incoming/changed');
        debug && console.log(`[VideoConf] Notifying user ${callData.uid} that we accept their call.`);
        this.userId && this.notifyUser(callData.uid, 'accepted', { callId, uid: this.userId, rid: callData.rid });
    }
    rejectIncomingCall(callId) {
        this.dismissIncomingCall(callId);
        const callData = this.incomingDirectCalls.get(callId);
        if (!callData) {
            return;
        }
        this.userId && this.notifyUser(callData.uid, 'rejected', { callId, uid: this.userId, rid: callData.rid });
        this.loseIncomingCall(callId);
    }
    dismissedIncomingCalls() {
        // Mute all calls that are currently ringing
        if ([...this.incomingDirectCalls.keys()].some((callId) => this.dismissedIncomingCallHelper(callId))) {
            this.emit('ringing/changed');
            this.emit('incoming/changed');
        }
    }
    loadCapabilities() {
        return __awaiter(this, void 0, void 0, function* () {
            const { capabilities } = yield SDKClient_1.sdk.rest.get('/v1/video-conference.capabilities').catch((e) => {
                debug && console.error(`[VideoConf] Failed to load video conference capabilities`);
                return Promise.reject(e);
            });
            this._capabilities = capabilities || {};
            this.emit('capabilities/changed');
        });
    }
    setIncomingCallAttribute(callId, attributeName, value) {
        const callData = this.incomingDirectCalls.get(callId);
        if (!callData) {
            debug && console.error(`[VideoConf] Cannot change attribute "${attributeName}" of unknown call "${callId}".`);
            return;
        }
        const newData = Object.assign({}, callData);
        if (value === undefined) {
            delete newData[attributeName];
        }
        else {
            newData[attributeName] = value;
        }
        debug && console.log(`[VideoConf] Updating attribute "${attributeName}" of call "${callId}".`);
        this.incomingDirectCalls.set(callId, newData);
    }
    dismissedIncomingCallHelper(callId) {
        // Muting will stop a callId from ringing, but it doesn't affect any part of the existing workflow
        if (this.isCallDismissed(callId)) {
            return false;
        }
        debug && console.log(`[VideoConf] Dismissing call ${callId}`);
        this.dismissedCalls.add(callId);
        // We don't need to hold on to the dismissed callIds forever because the server won't let anyone call us with it for very long
        setTimeout(() => this.dismissedCalls.delete(callId), CALL_TIMEOUT * 20);
        // Only change the state if this call is actually in our list
        return this.incomingDirectCalls.has(callId);
    }
    dismissIncomingCall(callId) {
        if (this.dismissedIncomingCallHelper(callId)) {
            this.emit('ringing/changed');
            this.emit('incoming/changed');
            return true;
        }
        return false;
    }
    updateUser() {
        const userId = meteor_1.Meteor.userId();
        if (this.userId === userId) {
            debug && console.log(`[VideoConf] Logged user has not changed, so we're not changing the hooks.`);
            return;
        }
        debug && console.log(`[VideoConf] Logged user has changed.`);
        if (this.userId) {
            this.disconnect();
        }
        if (userId) {
            this.connectUser(userId);
        }
    }
    changePreference(key, value) {
        this._preferences[key] = value;
        this.emit('preference/changed', { key, value });
    }
    setPreferences(prefs) {
        for (const key in prefs) {
            if (prefs.hasOwnProperty(key)) {
                const prefKey = key;
                this.changePreference(prefKey, prefs[prefKey]);
            }
        }
    }
    joinCall(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            debug && console.log(`[VideoConf] Joining call ${callId}.`);
            if (this.incomingDirectCalls.has(callId)) {
                const data = this.incomingDirectCalls.get(callId);
                if (data === null || data === void 0 ? void 0 : data.acceptTimeout) {
                    debug && console.log('[VideoConf] Clearing acceptance timeout');
                    clearTimeout(data.acceptTimeout);
                }
                this.removeIncomingCall(callId);
            }
            const params = {
                callId,
                state: Object.assign(Object.assign({}, (this._preferences.mic !== undefined ? { mic: this._preferences.mic } : {})), (this._preferences.cam !== undefined ? { cam: this._preferences.cam } : {})),
            };
            const { url, providerName } = yield SDKClient_1.sdk.rest.post('/v1/video-conference.join', params).catch((e) => {
                var _a, _b;
                debug && console.error(`[VideoConf] Failed to join call ${callId}`);
                this.emit('join/error', { error: ((_b = (_a = e === null || e === void 0 ? void 0 : e.xhr) === null || _a === void 0 ? void 0 : _a.responseJSON) === null || _b === void 0 ? void 0 : _b.error) || 'unknown-error' });
                return Promise.reject(e);
            });
            if (!url) {
                throw new Error('Failed to get video conference URL.');
            }
            debug && console.log(`[VideoConf] Opening ${url}.`);
            this.emit('call/join', { url, callId, providerName });
        });
    }
    abortCall() {
        if (!this.currentCallData) {
            return;
        }
        this.giveUp(this.currentCallData);
    }
    rejectIncomingCallsFromUser(userId) {
        for (const [, { callId, uid }] of this.incomingDirectCalls) {
            if (userId === uid) {
                debug && console.log(`[VideoConf] Rejecting old incoming call from user ${userId}`);
                this.rejectIncomingCall(callId);
            }
        }
    }
    callUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uid, rid, callId }) {
            if (this.currentCallHandler || this.currentCallData) {
                throw new Error('Video Conference State Error.');
            }
            let attempt = 1;
            this.currentCallData = { callId, rid, uid };
            this.currentCallHandler = setInterval(() => {
                if (!this.currentCallHandler) {
                    debug && console.warn(`[VideoConf] Ringing interval was not properly cleared.`);
                    return;
                }
                attempt++;
                if (attempt > CALL_ATTEMPT_LIMIT) {
                    this.giveUp({ uid, rid, callId });
                    return;
                }
                debug && console.log(`[VideoConf] Ringing user ${uid}, attempt number ${attempt}.`);
                this.userId && this.notifyUser(uid, 'call', { uid: this.userId, rid, callId });
            }, CALL_INTERVAL);
            this.emit('calling/changed');
            debug && console.log(`[VideoConf] Ringing user ${uid} for the first time.`);
            this.userId && this.notifyUser(uid, 'call', { uid: this.userId, rid, callId });
        });
    }
    giveUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uid, rid, callId }) {
            var _b;
            const joined = (_b = this.currentCallData) === null || _b === void 0 ? void 0 : _b.joined;
            debug && console.log(`[VideoConf] Stop ringing user ${uid}.`);
            if (this.currentCallHandler) {
                clearInterval(this.currentCallHandler);
                this.currentCallHandler = undefined;
                this.currentCallData = undefined;
                this.emit('calling/changed');
            }
            debug && console.log(`[VideoConf] Notifying user ${uid} that we are no longer calling.`);
            this.userId && this.notifyUser(uid, 'canceled', { uid: this.userId, rid, callId });
            this.emit('direct/cancel', { uid, rid, callId });
            this.emit('direct/stopped', { uid, rid, callId });
            if (joined) {
                return;
            }
            SDKClient_1.sdk.rest.post('/v1/video-conference.cancel', { callId });
        });
    }
    disconnect() {
        debug && console.log(`[VideoConf] disconnecting user ${this.userId}`);
        for (const hook of this.hooks) {
            hook();
        }
        this.hooks = [];
        if (this.currentCallHandler) {
            clearInterval(this.currentCallHandler);
            this.currentCallHandler = undefined;
        }
        this.incomingDirectCalls.forEach((call) => {
            if (call.timeout) {
                clearTimeout(call.timeout);
            }
            if (call.acceptTimeout) {
                clearTimeout(call.acceptTimeout);
            }
        });
        this.userId = undefined;
        this.incomingDirectCalls.clear();
        this.dismissedCalls.clear();
        this.currentCallData = undefined;
        this._preferences = {};
        this.emit('incoming/changed');
        this.emit('ringing/changed');
        this.emit('calling/changed');
    }
    onVideoConfNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ action, params }) {
            if (!action || typeof action !== 'string') {
                debug && console.error('[VideoConf] Invalid action received.');
                return;
            }
            if (!params || typeof params !== 'object' || !params.callId || !params.uid || !params.rid) {
                debug && console.error('[VideoConf] Invalid params received.');
                return;
            }
            switch (action) {
                case 'call':
                    return this.onDirectCall(params);
                case 'canceled':
                    return this.onDirectCallCanceled(params);
                case 'accepted':
                    return this.onDirectCallAccepted(params);
                case 'rejected':
                    return this.onDirectCallRejected(params);
                case 'confirmed':
                    return this.onDirectCallConfirmed(params);
                case 'join':
                    return this.onDirectCallJoined(params);
                case 'end':
                    return this.onDirectCallEnded(params);
            }
        });
    }
    notifyUser(uid, action, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return SDKClient_1.sdk.publish('notify-user', [`${uid}/video-conference`, { action, params }]);
        });
    }
    connectUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            debug && console.log(`[VideoConf] connecting user ${userId}`);
            this.userId = userId;
            const { stop, ready } = SDKClient_1.sdk.stream('notify-user', [`${userId}/video-conference`], (data) => this.onVideoConfNotification(data));
            yield ready();
            this.hooks.push(stop);
        });
    }
    abortIncomingCall(callId) {
        var _a;
        // If we just accepted this call, then ignore the timeout
        if ((_a = this.incomingDirectCalls.get(callId)) === null || _a === void 0 ? void 0 : _a.acceptTimeout) {
            return;
        }
        debug && console.log(`[VideoConf] Canceling call ${callId} due to ringing timeout.`);
        this.loseIncomingCall(callId);
    }
    loseIncomingCall(callId) {
        const lostCall = this.incomingDirectCalls.get(callId);
        if (!lostCall) {
            debug && console.warn(`[VideoConf] Unable to cancel ${callId} because we have no information about it.`);
            return;
        }
        this.removeIncomingCall(callId);
        debug && console.log(`[VideoConf] Call ${callId} from ${lostCall.uid} was lost.`);
        this.emit('direct/lost', { callId, uid: lostCall.uid, rid: lostCall.rid });
    }
    removeIncomingCall(callId) {
        debug && console.log(`[VideoConf] Removing call with id "${callId}" from Incoming Calls list.`);
        if (!this.incomingDirectCalls.has(callId)) {
            return;
        }
        const isRinging = this.isRinging();
        const callData = this.incomingDirectCalls.get(callId);
        if (callData === null || callData === void 0 ? void 0 : callData.timeout) {
            clearTimeout(callData.timeout);
        }
        this.incomingDirectCalls.delete(callId);
        this.emit('incoming/changed');
        if (isRinging !== this.isRinging()) {
            this.emit('ringing/changed');
        }
    }
    createAbortTimeout(callId) {
        return setTimeout(() => this.abortIncomingCall(callId), CALL_TIMEOUT);
    }
    startNewIncomingCall({ callId, uid, rid }) {
        if (this.isCallDismissed(callId)) {
            debug && console.log(`[VideoConf] Ignoring dismissed call.`);
            return;
        }
        // Reject any currently ringing call from the user before registering the new one.
        this.rejectIncomingCallsFromUser(uid);
        debug && console.log(`[VideoConf] Storing this new call information.`);
        this.incomingDirectCalls.set(callId, {
            callId,
            uid,
            rid,
            timeout: this.createAbortTimeout(callId),
        });
        this.emit('incoming/changed');
        this.emit('ringing/changed');
        this.emit('direct/ringing', { callId, uid, rid });
    }
    refreshExistingIncomingCall({ callId, uid, rid }) {
        const existingData = this.incomingDirectCalls.get(callId);
        if (!existingData) {
            throw new Error('Video Conference Manager State Error');
        }
        debug && console.log(`[VideoConf] Resetting call timeout.`);
        if (existingData.timeout) {
            clearTimeout(existingData.timeout);
        }
        existingData.timeout = this.createAbortTimeout(callId);
        if (!this.isCallDismissed(callId)) {
            this.emit('direct/ringing', { callId, uid, rid });
        }
    }
    onDirectCall({ callId, uid, rid }) {
        var _a;
        // If we already accepted this call, then don't ring again
        if ((_a = this.incomingDirectCalls.get(callId)) === null || _a === void 0 ? void 0 : _a.acceptTimeout) {
            return;
        }
        debug && console.log(`[VideoConf] User ${uid} is ringing with call ${callId}.`);
        if (this.incomingDirectCalls.has(callId)) {
            this.refreshExistingIncomingCall({ callId, uid, rid });
        }
        else {
            this.startNewIncomingCall({ callId, uid, rid });
        }
    }
    onDirectCallCanceled({ callId }) {
        debug && console.log(`[VideoConf] Call ${callId} was canceled by the remote user.`);
        // We had just accepted this call, but the remote user hang up before they got the notification, so cancel our acceptance
        const callData = this.incomingDirectCalls.get(callId);
        if (callData === null || callData === void 0 ? void 0 : callData.acceptTimeout) {
            clearTimeout(callData.acceptTimeout);
            this.setIncomingCallAttribute(callId, 'acceptTimeout', undefined);
        }
        this.loseIncomingCall(callId);
    }
    onDirectCallAccepted(params, skipConfirmation = false) {
        var _a;
        if (!params.callId || params.callId !== ((_a = this.currentCallData) === null || _a === void 0 ? void 0 : _a.callId)) {
            debug && console.log(`[VideoConf] User ${params.uid} has accepted a call ${params.callId} from us, but we're not calling.`);
            return;
        }
        debug && console.log(`[VideoConf] User ${params.uid} has accepted our call ${params.callId}.`);
        // Stop ringing
        if (this.currentCallHandler) {
            clearInterval(this.currentCallHandler);
            this.currentCallHandler = undefined;
        }
        const callData = this.currentCallData;
        this.emit('direct/accepted', params);
        this.emit('direct/stopped', params);
        this.currentCallData = undefined;
        this.emit('calling/changed');
        if (!callData.joined) {
            this.joinCall(params.callId);
        }
        if (skipConfirmation) {
            return;
        }
        debug && console.log(`[VideoConf] Notifying user ${callData.uid} that they can join the call now.`);
        this.userId && this.notifyUser(callData.uid, 'confirmed', { callId: callData.callId, uid: this.userId, rid: callData.rid });
    }
    onDirectCallConfirmed(params) {
        var _a;
        if (!params.callId || !((_a = this.incomingDirectCalls.get(params.callId)) === null || _a === void 0 ? void 0 : _a.acceptTimeout)) {
            debug && console.log(`[VideoConf] User ${params.uid} confirmed we can join ${params.callId} but we aren't trying to join it.`);
            return;
        }
        this.joinCall(params.callId);
    }
    onDirectCallJoined(params) {
        var _a;
        if (!params.callId) {
            debug && console.log(`[VideoConf] Invalid 'video-conference.join' event received: ${params.callId}, ${params.uid}.`);
            return;
        }
        if (params.uid === this.userId) {
            if (((_a = this.currentCallData) === null || _a === void 0 ? void 0 : _a.callId) === params.callId) {
                debug && console.log(`[VideoConf] We joined our own call (${this.userId}) from somewhere else. Flagging the call appropriatelly.`);
                this.currentCallData.joined = true;
                this.emit('calling/changed');
                return;
            }
            if (this.incomingDirectCalls.has(params.callId)) {
                debug && console.log(`[VideoConf] We joined the call ${params.callId} from somewhere else. Dismissing it.`);
                this.dismissIncomingCall(params.callId);
                this.loseIncomingCall(params.callId);
            }
            return;
        }
        debug && console.log(`[VideoConf] User ${params.uid} has joined a call we started ${params.callId}.`);
        this.onDirectCallAccepted(params, true);
    }
    onDirectCallEnded(params) {
        var _a;
        if (!params.callId) {
            debug && console.log(`[VideoConf] Invalid 'video-conference.end' event received: ${params.callId}, ${params.uid}.`);
            return;
        }
        const callData = this.incomingDirectCalls.get(params.callId);
        if (callData) {
            debug && console.log(`[VideoConf] Incoming call ended by the server: ${params.callId}.`);
            if (callData.acceptTimeout) {
                clearTimeout(callData.acceptTimeout);
                this.setIncomingCallAttribute(params.callId, 'acceptTimeout', undefined);
            }
            this.loseIncomingCall(params.callId);
            return;
        }
        if (((_a = this.currentCallData) === null || _a === void 0 ? void 0 : _a.callId) !== params.callId) {
            debug && console.log(`[VideoConf] Server sent a call ended event for a call we're not aware of: ${params.callId}.`);
            return;
        }
        debug && console.log(`[VideoConf] Outgoing call ended by the server: ${params.callId}.`);
        // Stop ringing
        this.currentCallData = undefined;
        if (this.currentCallHandler) {
            clearInterval(this.currentCallHandler);
            this.currentCallHandler = undefined;
            this.emit('calling/changed');
            this.emit('direct/stopped', params);
        }
    }
    onDirectCallRejected(params) {
        var _a;
        if (!params.callId || params.callId !== ((_a = this.currentCallData) === null || _a === void 0 ? void 0 : _a.callId)) {
            debug && console.log(`[VideoConf] User ${params.uid} has rejected a call ${params.callId} from us, but we're not calling.`);
            return;
        }
        debug && console.log(`[VideoConf] User ${params.uid} has rejected our call ${params.callId}.`);
        // Stop ringing
        if (this.currentCallHandler) {
            clearInterval(this.currentCallHandler);
            this.currentCallHandler = undefined;
        }
        const { joined } = this.currentCallData;
        this.emit('direct/cancel', params);
        this.currentCallData = undefined;
        this.emit('direct/stopped', params);
        this.emit('calling/changed');
        if (!joined) {
            SDKClient_1.sdk.rest.post('/v1/video-conference.cancel', { callId: params.callId });
        }
    }
    isCallDismissed(callId) {
        return this.dismissedCalls.has(callId);
    }
})();
meteor_1.Meteor.startup(() => tracker_1.Tracker.autorun(() => exports.VideoConfManager.updateUser()));
