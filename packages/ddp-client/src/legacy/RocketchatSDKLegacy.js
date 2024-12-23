"use strict";
/* eslint-disable @typescript-eslint/no-this-alias */
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
exports.RocketchatSdkLegacyImpl = void 0;
const api_client_1 = require("@rocket.chat/api-client");
const emitter_1 = require("@rocket.chat/emitter");
const ClientStream_1 = require("../ClientStream");
const Connection_1 = require("../Connection");
const DDPDispatcher_1 = require("../DDPDispatcher");
const DDPSDK_1 = require("../DDPSDK");
const TimeoutControl_1 = require("../TimeoutControl");
const Account_1 = require("../types/Account");
class RocketchatSdkLegacyImpl extends DDPSDK_1.DDPSDK {
    constructor() {
        super(...arguments);
        this.ev = new emitter_1.Emitter();
        this.subscribeNotifyUser = () => {
            return Promise.all([
                this.stream('notify-user', `${this.account.uid}/message`, (...args) => this.ev.emit('user-message', args)),
                this.stream('notify-user', `${this.account.uid}/otr`, (...args) => this.ev.emit('otr', args)),
                this.stream('notify-user', `${this.account.uid}/webrtc`, (...args) => this.ev.emit('webrtc', args)),
                this.stream('notify-user', `${this.account.uid}/notification`, (...args) => this.ev.emit('notification', args)),
                this.stream('notify-user', `${this.account.uid}/rooms-changed`, (...args) => this.ev.emit('rooms-changed', args)),
                this.stream('notify-user', `${this.account.uid}/subscriptions-changed`, (...args) => this.ev.emit('subscriptions-changed', args)),
                this.stream('notify-user', `${this.account.uid}/uiInteraction`, (...args) => this.ev.emit('uiInteraction', args)),
            ]);
        };
    }
    get url() {
        return this.connection.url;
    }
    get users() {
        const self = this;
        return {
            all(fields) {
                return self.rest.get('/v1/users.list', { fields: JSON.stringify(fields) });
            },
            allNames() {
                return self.rest.get('/v1/users.list', { fields: JSON.stringify({ name: 1 }) });
            },
            allIDs() {
                return self.rest.get('/v1/users.list', { fields: JSON.stringify({ _id: 1 }) });
            },
            online(fields) {
                return self.rest.get('/v1/users.list', { fields: JSON.stringify(fields), query: JSON.stringify({ status: { $ne: 'offline' } }) });
            },
            onlineNames() {
                return self.rest.get('/v1/users.list', {
                    fields: JSON.stringify({ name: 1 }),
                    query: JSON.stringify({ status: { $ne: 'offline' } }),
                });
            },
            onlineIds() {
                return self.rest.get('/v1/users.list', {
                    fields: JSON.stringify({ _id: 1 }),
                    query: JSON.stringify({ status: { $ne: 'offline' } }),
                });
            },
            info(username) {
                return self.rest.get('/v1/users.info', { username });
            },
        };
    }
    get rooms() {
        const self = this;
        return {
            info: (args) => {
                return self.rest.get('/v1/rooms.info', args);
            },
            join: (rid) => {
                return self.rest.post('/v1/channels.join', { roomId: rid });
            },
            load: (rid, lastUpdate) => {
                return self.rest.get('/v1/chat.syncMessages', { roomId: rid, lastUpdate: lastUpdate.toISOString() });
            },
            leave: (rid) => {
                return self.rest.post('/v1/channels.leave', { roomId: rid });
            },
        };
    }
    joinRoom(args) {
        return this.rest.post('/v1/channels.join', { roomId: args.rid });
    }
    loadHistory(rid, lastUpdate) {
        return this.rest.get('/v1/chat.syncMessages', { roomId: rid, lastUpdate: lastUpdate.toISOString() });
    }
    leaveRoom(rid) {
        return this.rest.post('/v1/channels.leave', { roomId: rid });
    }
    get dm() {
        const self = this;
        return {
            create(username) {
                return self.rest.post('/v1/im.create', { username });
            },
        };
    }
    channelInfo(args) {
        return this.rest.get('/v1/channels.info', args);
    }
    privateInfo(args) {
        return this.rest.get('/v1/groups.info', args);
    }
    editMessage(args) {
        return this.rest.post('/v1/chat.update', args);
    }
    setReaction(emoji, messageId) {
        return this.rest.post('/v1/chat.react', { emoji, messageId });
    }
    createDirectMessage(username) {
        return this.rest.post('/v1/im.create', { username });
    }
    sendMessage(message, rid) {
        return this.rest.post('/v1/chat.sendMessage', {
            message: typeof message === 'string'
                ? {
                    msg: message,
                    rid,
                }
                : Object.assign(Object.assign({}, message), { rid }),
        });
    }
    resume({ token }) {
        return this.account.loginWithToken(token);
    }
    login(credentials) {
        return this.account.loginWithPassword(credentials.username, credentials.password);
    }
    onMessage(cb) {
        return this.ev.on('message', cb);
    }
    methodCall(method, ...args) {
        return this.client.callAsync(method, ...args);
    }
    subscribe(topic, ...args) {
        return this.client.subscribe(topic, ...args).ready();
    }
    subscribeRoom(rid) {
        return Promise.all([
            this.stream('room-messages', rid, (...args) => this.ev.emit('message', args)),
            this.stream('notify-room', `${rid}/typing`, (...args) => this.ev.emit('typing', args)),
            this.stream('notify-room', `${rid}/deleteMessage`, (...args) => this.ev.emit('deleteMessage', args)),
        ]);
    }
    subscribeNotifyAll() {
        return Promise.all([
            // this.stream('notify-all', 'roles-change', (...args) => this.ev.emit('roles-change', args)),
            // this.stream('notify-all', 'updateEmojiCustom', (...args) => this.ev.emit('updateEmojiCustom', args)),
            // this.stream('notify-all', 'deleteEmojiCustom', (...args) => this.ev.emit('deleteEmojiCustom', args)),
            // this.stream('notify-all', 'updateAvatar', (...args) => this.ev.emit('updateAvatar', args)),
            this.stream('notify-all', 'public-settings-changed', (...args) => this.ev.emit('public-settings-changed', args)),
        ]);
    }
    subscribeLoggedNotify() {
        return Promise.all([
            this.stream('notify-logged', 'Users:NameChanged', (...args) => this.ev.emit('Users:NameChanged', args)),
            this.stream('notify-logged', 'Users:Deleted', (...args) => this.ev.emit('Users:Deleted', args)),
            this.stream('notify-logged', 'updateAvatar', (...args) => this.ev.emit('updateAvatar', args)),
            this.stream('notify-logged', 'updateEmojiCustom', (...args) => this.ev.emit('updateEmojiCustom', args)),
            this.stream('notify-logged', 'deleteEmojiCustom', (...args) => this.ev.emit('deleteEmojiCustom', args)),
            this.stream('notify-logged', 'roles-change', (...args) => this.ev.emit('roles-change', args)),
            this.stream('notify-logged', 'permissions-changed', (...args) => this.ev.emit('permissions-changed', args)),
        ]);
    }
    onStreamData(event, cb) {
        return this.ev.on(event, cb);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.close();
        });
    }
    connect(_options) {
        return this.connection.connect();
    }
    unsubscribe(subscription) {
        return this.client.unsubscribe(subscription);
    }
    unsubscribeAll() {
        return Promise.all(Object.entries(this.client.subscriptions).map(([, subscription]) => this.client.unsubscribe(subscription)));
    }
    static create(url, retryOptions = { retryCount: 1, retryTime: 100 }) {
        const ddp = new DDPDispatcher_1.DDPDispatcher();
        const connection = Connection_1.ConnectionImpl.create(url, WebSocket, ddp, retryOptions);
        const stream = new ClientStream_1.ClientStreamImpl(ddp, ddp);
        const account = new Account_1.AccountImpl(stream);
        const timeoutControl = TimeoutControl_1.TimeoutControl.create(ddp, connection);
        const rest = new (class RestApiClient extends api_client_1.RestClient {
            getCredentials() {
                var _a, _b;
                if (!account.uid || !((_a = account.user) === null || _a === void 0 ? void 0 : _a.token)) {
                    return;
                }
                return {
                    'X-User-Id': account.uid,
                    'X-Auth-Token': (_b = account.user) === null || _b === void 0 ? void 0 : _b.token,
                };
            }
        })({ baseUrl: url });
        const sdk = new RocketchatSdkLegacyImpl(connection, stream, account, timeoutControl, rest);
        connection.on('connected', () => {
            Object.entries(stream.subscriptions).forEach(([, sub]) => {
                ddp.subscribeWithId(sub.id, sub.name, sub.params);
            });
        });
        return sdk;
    }
}
exports.RocketchatSdkLegacyImpl = RocketchatSdkLegacyImpl;
