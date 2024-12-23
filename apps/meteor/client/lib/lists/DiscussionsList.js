"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussionsList = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const MessageList_1 = require("./MessageList");
const isDiscussionMessageInRoom = (message, rid) => message.rid === rid && 'drid' in message;
const isDiscussionTextMatching = (discussionMessage, regex) => regex.test(discussionMessage.msg);
class DiscussionsList extends MessageList_1.MessageList {
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
        if (!isDiscussionMessageInRoom(message, rid)) {
            return false;
        }
        if (this._options.text) {
            const regex = new RegExp((0, string_helpers_1.escapeRegExp)(this._options.text), 'i');
            if (!isDiscussionTextMatching(message, regex)) {
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
exports.DiscussionsList = DiscussionsList;
