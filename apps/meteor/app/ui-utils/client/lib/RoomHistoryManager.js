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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomHistoryManager = void 0;
exports.upsertMessage = upsertMessage;
exports.upsertMessageBulk = upsertMessageBulk;
const emitter_1 = require("@rocket.chat/emitter");
const differenceInMilliseconds_1 = __importDefault(require("date-fns/differenceInMilliseconds"));
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const uuid_1 = require("uuid");
const onClientMessageReceived_1 = require("../../../../client/lib/onClientMessageReceived");
const callWithErrorHandling_1 = require("../../../../client/lib/utils/callWithErrorHandling");
const getConfig_1 = require("../../../../client/lib/utils/getConfig");
const waitForElement_1 = require("../../../../client/lib/utils/waitForElement");
const client_1 = require("../../../models/client");
const client_2 = require("../../../utils/client");
function upsertMessage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ msg, subscription, }, collection = client_1.Messages) {
        var _b, _c;
        const userId = (_b = msg.u) === null || _b === void 0 ? void 0 : _b._id;
        if ((_c = subscription === null || subscription === void 0 ? void 0 : subscription.ignored) === null || _c === void 0 ? void 0 : _c.includes(userId)) {
            msg.ignored = true;
        }
        if (msg.t === 'e2e' && !msg.file) {
            msg.e2e = 'pending';
        }
        msg = (yield (0, onClientMessageReceived_1.onClientMessageReceived)(msg)) || msg;
        const { _id } = msg;
        return collection.upsert({ _id }, msg);
    });
}
function upsertMessageBulk({ msgs, subscription }, collection = client_1.Messages) {
    const { queries } = collection;
    collection.queries = [];
    msgs.forEach((msg, index) => {
        if (index === msgs.length - 1) {
            collection.queries = queries;
        }
        void upsertMessage({ msg, subscription }, collection);
    });
}
const defaultLimit = parseInt((_a = (0, getConfig_1.getConfig)('roomListLimit')) !== null && _a !== void 0 ? _a : '50') || 50;
const waitAfterFlush = (fn) => setTimeout(() => tracker_1.Tracker.afterFlush(fn), 10);
class RoomHistoryManagerClass extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.histories = {};
        this.requestsList = [];
    }
    getRoom(rid) {
        if (!this.histories[rid]) {
            this.histories[rid] = {
                hasMore: new reactive_var_1.ReactiveVar(true),
                hasMoreNext: new reactive_var_1.ReactiveVar(false),
                isLoading: new reactive_var_1.ReactiveVar(false),
                unreadNotLoaded: new reactive_var_1.ReactiveVar(0),
                firstUnread: new reactive_var_1.ReactiveVar(undefined),
                loaded: undefined,
            };
        }
        return this.histories[rid];
    }
    queue() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const requestId = (0, uuid_1.v4)();
                const done = () => {
                    this.lastRequest = new Date();
                    resolve();
                };
                if (this.requestsList.length === 0) {
                    return this.run(done);
                }
                this.requestsList.push(requestId);
                this.once(requestId, done);
            });
        });
    }
    run(fn) {
        const difference = this.lastRequest ? (0, differenceInMilliseconds_1.default)(new Date(), this.lastRequest) : Infinity;
        if (difference > 500) {
            return fn();
        }
        return setTimeout(fn, 500 - difference);
    }
    unqueue() {
        const requestId = this.requestsList.pop();
        if (!requestId) {
            return;
        }
        this.run(() => this.emit(requestId));
    }
    getMore(rid_1) {
        return __awaiter(this, arguments, void 0, function* (rid, limit = defaultLimit) {
            const room = this.getRoom(rid);
            if (tracker_1.Tracker.nonreactive(() => room.hasMore.get()) !== true) {
                return;
            }
            room.isLoading.set(true);
            yield this.queue();
            let ls = undefined;
            const subscription = client_1.Subscriptions.findOne({ rid });
            if (subscription) {
                ({ ls } = subscription);
            }
            const showThreadsInMainChannel = (0, client_2.getUserPreference)(Meteor.userId(), 'showThreadsInMainChannel', false);
            const result = yield (0, callWithErrorHandling_1.callWithErrorHandling)('loadHistory', rid, room.oldestTs, limit, ls ? String(ls) : undefined, showThreadsInMainChannel);
            if (!result) {
                throw new Error('loadHistory returned nothing');
            }
            this.unqueue();
            let previousHeight;
            let scroll;
            const { messages = [] } = result;
            room.unreadNotLoaded.set(result.unreadNotLoaded);
            room.firstUnread.set(result.firstUnread);
            if (messages.length > 0) {
                room.oldestTs = messages[messages.length - 1].ts;
            }
            const wrapper = yield (0, waitForElement_1.waitForElement)('.messages-box .wrapper .rc-scrollbars-view');
            if (wrapper) {
                previousHeight = wrapper.scrollHeight;
                scroll = wrapper.scrollTop;
            }
            upsertMessageBulk({
                msgs: messages.filter((msg) => msg.t !== 'command'),
                subscription,
            });
            if (!room.loaded) {
                room.loaded = 0;
            }
            const visibleMessages = messages.filter((msg) => !msg.tmid || showThreadsInMainChannel || msg.tshow);
            room.loaded += visibleMessages.length;
            if (messages.length < limit) {
                room.hasMore.set(false);
            }
            if (room.hasMore.get() && (visibleMessages.length === 0 || room.loaded < limit)) {
                return this.getMore(rid);
            }
            waitAfterFlush(() => {
                this.emit('loaded-messages');
                const heightDiff = wrapper.scrollHeight - (previousHeight !== null && previousHeight !== void 0 ? previousHeight : NaN);
                wrapper.scrollTop = (scroll !== null && scroll !== void 0 ? scroll : NaN) + heightDiff;
            });
            room.isLoading.set(false);
        });
    }
    getMoreNext(rid, atBottomRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.getRoom(rid);
            if (tracker_1.Tracker.nonreactive(() => room.hasMoreNext.get()) !== true) {
                return;
            }
            yield this.queue();
            atBottomRef.current = false;
            room.isLoading.set(true);
            const lastMessage = client_1.Messages.findOne({ rid, _hidden: { $ne: true } }, { sort: { ts: -1 } });
            const subscription = client_1.Subscriptions.findOne({ rid });
            if (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.ts) {
                const { ts } = lastMessage;
                const result = yield (0, callWithErrorHandling_1.callWithErrorHandling)('loadNextMessages', rid, ts, defaultLimit);
                upsertMessageBulk({
                    msgs: Array.from(result.messages).filter((msg) => msg.t !== 'command'),
                    subscription,
                });
                room.isLoading.set(false);
                if (!room.loaded) {
                    room.loaded = 0;
                }
                room.loaded += result.messages.length;
                if (result.messages.length < defaultLimit) {
                    room.hasMoreNext.set(false);
                }
            }
            this.unqueue();
        });
    }
    hasMore(rid) {
        const room = this.getRoom(rid);
        return room.hasMore.get();
    }
    hasMoreNext(rid) {
        const room = this.getRoom(rid);
        return room.hasMoreNext.get();
    }
    getMoreIfIsEmpty(rid) {
        const room = this.getRoom(rid);
        if (room.loaded === undefined) {
            return this.getMore(rid);
        }
    }
    isLoading(rid) {
        const room = this.getRoom(rid);
        return room.isLoading.get();
    }
    clear(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.getRoom(rid);
            client_1.Messages.remove({ rid });
            room.isLoading.set(true);
            room.hasMore.set(true);
            room.hasMoreNext.set(false);
            room.oldestTs = undefined;
            room.loaded = undefined;
        });
    }
    getSurroundingMessages(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(message === null || message === void 0 ? void 0 : message.rid)) {
                return;
            }
            const messageAlreadyLoaded = Boolean(client_1.Messages.findOne({ _id: message._id, _hidden: { $ne: true } }));
            if (messageAlreadyLoaded) {
                return;
            }
            const room = this.getRoom(message.rid);
            void this.clear(message.rid);
            const subscription = client_1.Subscriptions.findOne({ rid: message.rid });
            const result = yield (0, callWithErrorHandling_1.callWithErrorHandling)('loadSurroundingMessages', message, defaultLimit);
            if (!result) {
                return;
            }
            upsertMessageBulk({ msgs: Array.from(result.messages).filter((msg) => msg.t !== 'command'), subscription });
            tracker_1.Tracker.afterFlush(() => __awaiter(this, void 0, void 0, function* () {
                this.emit('loaded-messages');
                room.isLoading.set(false);
            }));
            if (!room.loaded) {
                room.loaded = 0;
            }
            room.loaded += result.messages.length;
            room.hasMore.set(result.moreBefore);
            room.hasMoreNext.set(result.moreAfter);
        });
    }
}
exports.RoomHistoryManager = new RoomHistoryManagerClass();
