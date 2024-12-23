"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsList = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const MessageList_1 = require("./MessageList");
const isThreadMessageInRoom = (message, rid) => message.rid === rid && typeof message.tcount === 'number';
const isThreadFollowedByUser = (threadMessage, uid) => { var _a, _b; return (_b = (_a = threadMessage.replies) === null || _a === void 0 ? void 0 : _a.includes(uid)) !== null && _b !== void 0 ? _b : false; };
const isThreadUnread = (threadMessage, tunread) => Boolean(tunread === null || tunread === void 0 ? void 0 : tunread.includes(threadMessage._id));
const isThreadTextMatching = (threadMessage, regex) => regex.test(threadMessage.msg);
class ThreadsList extends MessageList_1.MessageList {
    constructor(_options) {
        super();
        this._options = _options;
    }
    get options() {
        return this._options;
    }
    updateFilters(options) {
        this._options = options;
        this.clear();
    }
    filter(message) {
        const { rid } = this._options;
        if (!isThreadMessageInRoom(message, rid)) {
            return false;
        }
        if (this._options.type === 'following') {
            const { uid } = this._options;
            if (!isThreadFollowedByUser(message, uid)) {
                return false;
            }
        }
        if (this._options.type === 'unread') {
            const { tunread } = this._options;
            if (!isThreadUnread(message, tunread)) {
                return false;
            }
        }
        if (this._options.text) {
            const regex = new RegExp((0, string_helpers_1.escapeRegExp)(this._options.text), 'i');
            if (!isThreadTextMatching(message, regex)) {
                return false;
            }
        }
        return true;
    }
    compare(a, b) {
        var _a, _b;
        return ((_a = b.tlm) !== null && _a !== void 0 ? _a : b.ts).getTime() - ((_b = a.tlm) !== null && _b !== void 0 ? _b : a.ts).getTime();
    }
}
exports.ThreadsList = ThreadsList;
