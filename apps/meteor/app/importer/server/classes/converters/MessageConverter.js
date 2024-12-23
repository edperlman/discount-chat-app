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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConverter = void 0;
const models_1 = require("@rocket.chat/models");
const limax_1 = __importDefault(require("limax"));
const RecordConverter_1 = require("./RecordConverter");
const insertMessage_1 = require("../../../../lib/server/functions/insertMessage");
class MessageConverter extends RecordConverter_1.RecordConverter {
    constructor() {
        super(...arguments);
        this.rids = [];
    }
    convertData() {
        const _super = Object.create(null, {
            convertData: { get: () => super.convertData }
        });
        return __awaiter(this, arguments, void 0, function* (_a = {}) {
            var { afterImportAllMessagesFn } = _a, callbacks = __rest(_a, ["afterImportAllMessagesFn"]);
            this.rids = [];
            yield _super.convertData.call(this, callbacks);
            yield this.resetLastMessages();
            if (afterImportAllMessagesFn) {
                yield afterImportAllMessagesFn(this.rids);
            }
        });
    }
    resetLastMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                for (var _d = true, _e = __asyncValues(this.rids), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const rid = _c;
                    try {
                        yield models_1.Rooms.resetLastMessageById(rid, null);
                    }
                    catch (e) {
                        this._logger.warn(`Failed to update last message of room ${rid}`);
                        this._logger.error(e);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    insertMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.ts || isNaN(data.ts)) {
                throw new Error('importer-message-invalid-timestamp');
            }
            const creator = yield this._cache.findImportedUser(data.u._id);
            if (!creator) {
                this._logger.warn(`Imported user not found: ${data.u._id}`);
                throw new Error('importer-message-unknown-user');
            }
            const rid = yield this._cache.findImportedRoomId(data.rid);
            if (!rid) {
                throw new Error('importer-message-unknown-room');
            }
            if (!this.rids.includes(rid)) {
                this.rids.push(rid);
            }
            const msgObj = yield this.buildMessageObject(data, rid, creator);
            try {
                yield (0, insertMessage_1.insertMessage)(creator, msgObj, rid, true);
            }
            catch (e) {
                this._logger.warn(`Failed to import message with timestamp ${String(msgObj.ts)} to room ${rid}`);
                this._logger.error(e);
            }
        });
    }
    convertRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.insertMessage(record.data);
            return true;
        });
    }
    buildMessageObject(data, rid, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert the mentions and channels first because these conversions can also modify the msg in the message object
            const mentions = data.mentions && (yield this.convertMessageMentions(data));
            const channels = data.channels && (yield this.convertMessageChannels(data));
            return Object.assign(Object.assign({ rid, u: {
                    _id: creator._id,
                    username: creator.username,
                }, msg: data.msg, ts: data.ts, t: data.t || undefined, groupable: data.groupable, tmid: data.tmid, tlm: data.tlm, tcount: data.tcount, replies: data.replies && (yield this.convertMessageReplies(data.replies)), editedAt: data.editedAt, editedBy: data.editedBy && ((yield this._cache.findImportedUser(data.editedBy)) || undefined), mentions,
                channels, _importFile: data._importFile, url: data.url, attachments: data.attachments, bot: data.bot, emoji: data.emoji, alias: data.alias }, (data._id ? { _id: data._id } : {})), (data.reactions ? { reactions: yield this.convertMessageReactions(data.reactions) } : {}));
        });
    }
    convertMessageChannels(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            const { channels } = message;
            if (!channels) {
                return;
            }
            const result = [];
            try {
                for (var _d = true, channels_1 = __asyncValues(channels), channels_1_1; channels_1_1 = yield channels_1.next(), _a = channels_1_1.done, !_a; _d = true) {
                    _c = channels_1_1.value;
                    _d = false;
                    const importId = _c;
                    const { name, _id } = (yield this.getMentionedChannelData(importId)) || {};
                    if (!_id || !name) {
                        this._logger.warn(`Mentioned room not found: ${importId}`);
                        continue;
                    }
                    message.msg = message.msg.replace(new RegExp(`\#${importId}`, 'gi'), `#${name}`);
                    result.push({
                        _id,
                        name,
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = channels_1.return)) yield _b.call(channels_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        });
    }
    convertMessageMentions(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            const { mentions } = message;
            if (!mentions) {
                return undefined;
            }
            const result = [];
            try {
                for (var _d = true, mentions_1 = __asyncValues(mentions), mentions_1_1; mentions_1_1 = yield mentions_1.next(), _a = mentions_1_1.done, !_a; _d = true) {
                    _c = mentions_1_1.value;
                    _d = false;
                    const importId = _c;
                    if (importId === 'all' || importId === 'here') {
                        result.push({
                            _id: importId,
                            username: importId,
                        });
                        continue;
                    }
                    // Loading the name will also store the remaining data on the cache if it's missing, so this won't run two queries
                    const name = yield this._cache.findImportedUserDisplayName(importId);
                    const data = yield this._cache.findImportedUser(importId);
                    if (!data) {
                        this._logger.warn(`Mentioned user not found: ${importId}`);
                        continue;
                    }
                    if (!data.username) {
                        this._logger.debug(importId);
                        throw new Error('importer-message-mentioned-username-not-found');
                    }
                    message.msg = message.msg.replace(new RegExp(`\@${importId}`, 'gi'), `@${data.username}`);
                    result.push({
                        _id: data._id,
                        username: data.username,
                        name,
                    });
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = mentions_1.return)) yield _b.call(mentions_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return result;
        });
    }
    convertMessageReactions(importedReactions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_4, _b, _c, _d, e_5, _e, _f;
            const reactions = {};
            try {
                for (var _g = true, _h = __asyncValues(Object.keys(importedReactions)), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                    _c = _j.value;
                    _g = false;
                    const name = _c;
                    if (!importedReactions.hasOwnProperty(name)) {
                        continue;
                    }
                    const { users } = importedReactions[name];
                    if (!users.length) {
                        continue;
                    }
                    const reaction = {
                        name,
                        usernames: [],
                    };
                    try {
                        for (var _k = true, users_1 = (e_5 = void 0, __asyncValues(users)), users_1_1; users_1_1 = yield users_1.next(), _d = users_1_1.done, !_d; _k = true) {
                            _f = users_1_1.value;
                            _k = false;
                            const importId = _f;
                            const username = yield this._cache.findImportedUsername(importId);
                            if (username && !reaction.usernames.includes(username)) {
                                reaction.usernames.push(username);
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (!_k && !_d && (_e = users_1.return)) yield _e.call(users_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    if (reaction.usernames.length) {
                        reactions[name] = reaction;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (Object.keys(reactions).length > 0) {
                return reactions;
            }
        });
    }
    convertMessageReplies(replies) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, replies_1, replies_1_1;
            var _b, e_6, _c, _d;
            const result = [];
            try {
                for (_a = true, replies_1 = __asyncValues(replies); replies_1_1 = yield replies_1.next(), _b = replies_1_1.done, !_b; _a = true) {
                    _d = replies_1_1.value;
                    _a = false;
                    const importId = _d;
                    const userId = yield this._cache.findImportedUserId(importId);
                    if (userId && !result.includes(userId)) {
                        result.push(userId);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = replies_1.return)) yield _c.call(replies_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return result;
        });
    }
    getMentionedChannelData(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            // loading the name will also store the id on the cache if it's missing, so this won't run two queries
            const name = yield this._cache.findImportedRoomName(importId);
            const _id = yield this._cache.findImportedRoomId(importId);
            if (name && _id) {
                return {
                    name,
                    _id,
                };
            }
            // If the importId was not found, check if we have a room with that name
            const roomName = (0, limax_1.default)(importId.trim(), { maintainCase: true });
            const room = yield models_1.Rooms.findOneByNonValidatedName(roomName, { projection: { name: 1 } });
            if (room === null || room === void 0 ? void 0 : room.name) {
                this._cache.addRoom(importId, room._id);
                this._cache.addRoomName(importId, room.name);
                return {
                    name: room.name,
                    _id: room._id,
                };
            }
        });
    }
    getDataType() {
        return 'message';
    }
}
exports.MessageConverter = MessageConverter;
