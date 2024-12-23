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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionsServer = void 0;
/*
 * Mentions is a named function that will process Mentions
 * @param {Object} message - The message object
 */
const core_typings_1 = require("@rocket.chat/core-typings");
const MentionsParser_1 = require("../lib/MentionsParser");
class MentionsServer extends MentionsParser_1.MentionsParser {
    constructor(args) {
        super(args);
        this.messageMaxAll = args.messageMaxAll;
        this.getChannels = args.getChannels;
        this.getUsers = args.getUsers;
        this.getUser = args.getUser;
        this.getTotalChannelMembers = args.getTotalChannelMembers;
        this.onMaxRoomMembersExceeded =
            args.onMaxRoomMembersExceeded ||
                (() => {
                    /* do nothing */
                });
    }
    getUsersByMentions(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const { msg, rid, u: sender, e2eMentions } = message;
            const mentions = (0, core_typings_1.isE2EEMessage)(message) && (e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eUserMentions) && (e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eUserMentions.length) > 0
                ? e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eUserMentions
                : this.getUserMentions(msg);
            const mentionsAll = [];
            const userMentions = [];
            try {
                for (var _d = true, mentions_1 = __asyncValues(mentions), mentions_1_1; mentions_1_1 = yield mentions_1.next(), _a = mentions_1_1.done, !_a; _d = true) {
                    _c = mentions_1_1.value;
                    _d = false;
                    const m = _c;
                    const mention = m.trim().substr(1);
                    if (mention !== 'all' && mention !== 'here') {
                        userMentions.push(mention);
                        continue;
                    }
                    if (this.messageMaxAll() > 0 && (yield this.getTotalChannelMembers(rid)) > this.messageMaxAll()) {
                        yield this.onMaxRoomMembersExceeded({ sender, rid });
                        continue;
                    }
                    mentionsAll.push({
                        _id: mention,
                        username: mention,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = mentions_1.return)) yield _b.call(mentions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [...mentionsAll, ...(userMentions.length ? yield this.getUsers(userMentions) : [])];
        });
    }
    getChannelbyMentions(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { msg, e2eMentions } = message;
            const channels = (0, core_typings_1.isE2EEMessage)(message) && (e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eChannelMentions) && (e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eChannelMentions.length) > 0
                ? e2eMentions === null || e2eMentions === void 0 ? void 0 : e2eMentions.e2eChannelMentions
                : this.getChannelMentions(msg);
            return this.getChannels(channels.map((c) => c.trim().substr(1)));
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentionsAll = yield this.getUsersByMentions(message);
            const channels = yield this.getChannelbyMentions(message);
            message.mentions = mentionsAll;
            message.channels = channels;
            return message;
        });
    }
}
exports.MentionsServer = MentionsServer;
