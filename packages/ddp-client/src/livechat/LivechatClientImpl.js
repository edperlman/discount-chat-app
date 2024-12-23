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
exports.LivechatClientImpl = void 0;
const api_client_1 = require("@rocket.chat/api-client");
const emitter_1 = require("@rocket.chat/emitter");
const ClientStream_1 = require("../ClientStream");
const Connection_1 = require("../Connection");
const DDPDispatcher_1 = require("../DDPDispatcher");
const DDPSDK_1 = require("../DDPSDK");
const TimeoutControl_1 = require("../TimeoutControl");
const Account_1 = require("../types/Account");
class LivechatClientImpl extends DDPSDK_1.DDPSDK {
    constructor() {
        super(...arguments);
        this.credentials = { token: this.token };
        this.ev = new emitter_1.Emitter();
    }
    subscribeRoom(rid) {
        return Promise.all([
            this.onRoomMessage(rid, (...args) => this.ev.emit('message', args)),
            this.onRoomUserActivity(rid, (...args) => this.ev.emit('userActivity', args)),
            this.onRoomDeleteMessage(rid, (...args) => this.ev.emit('delete', args)),
        ]);
    }
    onMessage(cb) {
        return this.ev.on('message', (args) => cb(...args));
    }
    onUserActivity(cb) {
        return this.ev.on('userActivity', (args) => args[1] && cb(args[0], args[1]));
    }
    onRoomMessage(rid, cb) {
        return this.stream('room-messages', [rid, { token: this.token, visitorToken: this.token }], cb).stop;
    }
    onRoomUserActivity(rid, cb) {
        return this.stream('notify-room', [`${rid}/user-activity`, { token: this.token, visitorToken: this.token }], cb).stop;
    }
    onRoomDeleteMessage(rid, cb) {
        return this.stream('notify-room', [`${rid}/deleteMessage`, { token: this.token, visitorToken: this.token }], cb).stop;
    }
    onAgentChange(rid, cb) {
        return this.stream('livechat-room', [rid, { token: this.token, visitorToken: this.token }], (data) => {
            if (data.type === 'agentData') {
                cb(data.data);
            }
        }).stop;
    }
    onAgentStatusChange(rid, cb) {
        return this.stream('livechat-room', [rid, { token: this.token, visitorToken: this.token }], (data) => {
            if (data.type === 'agentStatus') {
                cb(data.status);
            }
        }).stop;
    }
    onQueuePositionChange(rid, cb) {
        return this.stream('livechat-room', rid, (data) => {
            if (data.type === 'queueData') {
                cb(data.data);
            }
        }).stop;
    }
    onVisitorChange(rid, cb) {
        return this.stream('livechat-room', [rid, { token: this.token, visitorToken: this.token }], (data) => {
            if (data.type === 'visitorData') {
                cb(data.visitor);
            }
        }).stop;
    }
    notifyVisitorActivity(rid, username, activity) {
        return this.client.callAsync('stream-notify-room', `${rid}/user-activity`, username, activity, { token: this.token });
    }
    notifyCallDeclined(rid) {
        return this.client.callAsync('stream-notify-room', `${rid}/call`, 'decline');
    }
    // API GETTERS
    config(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { config } = yield this.rest.get('/v1/livechat/config', params);
            return config;
        });
    }
    room(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error('Invalid token');
            }
            const result = yield this.rest.get('/v1/livechat/room', Object.assign(Object.assign({}, params), { token: this.token }));
            // TODO: On major version bump, normalize the return of /v1/livechat/room
            function isRoomObject(room) {
                return room.room !== undefined;
            }
            if (isRoomObject(result)) {
                return result.room;
            }
            return result;
        });
    }
    visitor(params) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        const endpoint = `/v1/livechat/visitor/${this.token}`;
        return this.rest.get(endpoint, params);
    }
    nextAgent(params) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.get(`/v1/livechat/agent.next/${this.token}`, params);
    }
    agent(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error('Invalid token');
            }
            const { agent } = yield this.rest.get(`/v1/livechat/agent.info/${rid}/${this.token}`);
            return agent;
        });
    }
    message(id, params) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.get(`/v1/livechat/message/${id}`, Object.assign(Object.assign({}, params), { token: this.token }));
    }
    loadMessages(rid, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error('Invalid token');
            }
            const { messages } = yield this.rest.get(`/v1/livechat/messages.history/${rid}`, Object.assign(Object.assign({}, params), { token: this.token }));
            return messages;
        });
    }
    // API POST
    transferChat({ rid, department, }) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/room.transfer', { rid, token: this.token, department });
    }
    grantVisitor(guest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.rest.post('/v1/livechat/visitor', guest);
            this.token = result === null || result === void 0 ? void 0 : result.visitor.token;
            return result;
        });
    }
    login(guest) {
        return this.grantVisitor(guest);
    }
    closeChat({ rid }) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/room.close', { rid, token: this.token });
    }
    chatSurvey(params) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/room.survey', { rid: params.rid, token: this.token, data: params.data });
    }
    updateCallStatus(callStatus, rid, callId) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/visitor.callStatus', { token: this.token, callStatus, rid, callId });
    }
    sendMessage(params) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/message', Object.assign(Object.assign({}, params), { token: this.token }));
    }
    sendOfflineMessage(params) {
        return this.rest.post('/v1/livechat/offline.message', params);
    }
    sendVisitorNavigation(params) {
        return this.rest.post('/v1/livechat/page.visited', params);
    }
    requestTranscript(email, { rid }) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.post('/v1/livechat/transcript', { token: this.token, rid, email });
    }
    sendCustomField(params) {
        return this.rest.post('/v1/livechat/custom.field', params);
    }
    sendCustomFields(params) {
        return this.rest.post('/v1/livechat/custom.fields', params);
    }
    updateVisitorStatus(newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error('Invalid token');
            }
            const { status } = yield this.rest.post('/v1/livechat/visitor.status', { token: this.token, status: newStatus });
            return status;
        });
    }
    uploadFile(rid, file) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        if (!file) {
            throw new Error('Invalid file');
        }
        return new Promise((resolve, reject) => {
            if (!this.token) {
                return reject(new Error('Invalid token'));
            }
            return this.rest.upload(`/v1/livechat/upload/${rid}`, { file }, {
                load: resolve,
                error: reject,
            }, { headers: { 'x-visitor-token': this.token } });
        });
    }
    sendUiInteraction(payload, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error('Invalid token');
            }
            return this.rest.post(`/apps/ui.interaction/${appId}`, payload, { headers: { 'x-visitor-token': this.token } });
        });
    }
    // API DELETE
    deleteMessage(id, { rid }) {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.delete(`/v1/livechat/message/${id}`, { rid, token: this.token });
    }
    deleteVisitor() {
        if (!this.token) {
            throw new Error('Invalid token');
        }
        return this.rest.delete(`/v1/livechat/visitor/${this.token}`);
    }
    // API PUT
    editMessage(id, params) {
        return this.rest.put(`/v1/livechat/message/${id}`, params);
    }
    unsubscribeAll() {
        const subscriptions = Array.from(this.client.subscriptions.keys());
        return Promise.all(subscriptions.map((subscription) => this.client.unsubscribe(subscription)));
    }
    static create(url, retryOptions = { retryCount: 3, retryTime: 10000 }) {
        // TODO: Decide what to do with the EJSON objects
        const ddp = new DDPDispatcher_1.DDPDispatcher();
        const connection = Connection_1.ConnectionImpl.create(url, WebSocket, ddp, retryOptions);
        const stream = new ClientStream_1.ClientStreamImpl(ddp, ddp);
        const account = new Account_1.AccountImpl(stream);
        const timeoutControl = TimeoutControl_1.TimeoutControl.create(ddp, connection);
        const rest = new api_client_1.RestClient({ baseUrl: url.replace(/^ws/, 'http') });
        const sdk = new LivechatClientImpl(connection, stream, account, timeoutControl, rest);
        connection.on('connected', () => {
            for (const [, sub] of stream.subscriptions.entries()) {
                ddp.subscribeWithId(sub.id, sub.name, sub.params);
            }
        });
        return sdk;
    }
}
exports.LivechatClientImpl = LivechatClientImpl;
