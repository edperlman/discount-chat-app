"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessageSearchQuery = parseMessageSearchQuery;
const string_helpers_1 = require("@rocket.chat/string-helpers");
class MessageSearchQueryParser {
    constructor({ user, offset = 0, limit = 20, forceRegex = false, }) {
        this.query = {};
        this.options = {
            projection: {},
            sort: {
                ts: -1,
            },
            skip: 0,
            limit: 20,
        };
        this.forceRegex = false;
        this.user = user;
        this.options.skip = offset;
        this.options.limit = limit;
        this.forceRegex = forceRegex;
    }
    consumeFrom(text) {
        const from = [];
        return text.replace(/from:([a-z0-9.\-_]+)/gi, (_, username) => {
            var _a;
            if (username === 'me' && ((_a = this.user) === null || _a === void 0 ? void 0 : _a.username) && !from.includes(this.user.username)) {
                username = this.user.username;
            }
            from.push(username);
            this.query['u.username'] = {
                $regex: from.join('|'),
                $options: 'i',
            };
            return '';
        });
    }
    consumeMention(text) {
        const mentions = [];
        return text.replace(/mention:([a-z0-9.\-_]+)/gi, (_, username) => {
            mentions.push(username);
            this.query['mentions.username'] = {
                $regex: mentions.join('|'),
                $options: 'i',
            };
            return '';
        });
    }
    /**
     * Filter on messages that are starred by the current user.
     */
    consumeHasStar(text) {
        return text.replace(/has:star/g, () => {
            var _a;
            if ((_a = this.user) === null || _a === void 0 ? void 0 : _a._id) {
                this.query['starred._id'] = this.user._id;
            }
            return '';
        });
    }
    /**
     * Filter on messages that have an url.
     */
    consumeHasUrl(text) {
        return text.replace(/has:url|has:link/g, () => {
            this.query['urls.0'] = {
                $exists: true,
            };
            return '';
        });
    }
    /**
     * Filter on pinned messages.
     */
    consumeIsPinned(text) {
        return text.replace(/is:pinned|has:pin/g, () => {
            this.query.pinned = true;
            return '';
        });
    }
    /**
     * Filter on messages which have a location attached.
     */
    consumeHasLocation(text) {
        return text.replace(/has:location|has:map/g, () => {
            this.query.location = {
                $exists: true,
            };
            return '';
        });
    }
    /**
     * Filter image tags
     */
    consumeLabel(text) {
        return text.replace(/label:(\w+)/g, (_, tag) => {
            this.query['attachments.0.labels'] = {
                $regex: (0, string_helpers_1.escapeRegExp)(tag),
                $options: 'i',
            };
            return '';
        });
    }
    /**
     * Filter on description of messages.
     */
    consumeFileDescription(text) {
        return text.replace(/file-desc:(\w+)/g, (_, tag) => {
            this.query['attachments.description'] = {
                $regex: (0, string_helpers_1.escapeRegExp)(tag),
                $options: 'i',
            };
            return '';
        });
    }
    /**
     * Filter on title of messages.
     */
    consumeFileTitle(text) {
        return text.replace(/file-title:(\w+)/g, (_, tag) => {
            this.query['attachments.title'] = {
                $regex: (0, string_helpers_1.escapeRegExp)(tag),
                $options: 'i',
            };
            return '';
        });
    }
    /**
     * Filter on messages that have been sent before a date.
     */
    consumeBefore(text) {
        return text.replace(/before:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, (_, day, month, year) => {
            var _a, _b;
            const beforeDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            beforeDate.setUTCHours(beforeDate.getUTCHours() + beforeDate.getTimezoneOffset() / 60 + ((_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.utcOffset) !== null && _b !== void 0 ? _b : 0));
            this.query.ts = Object.assign(Object.assign({}, this.query.ts), { $lte: beforeDate });
            return '';
        });
    }
    /**
     * Filter on messages that have been sent after a date.
     */
    consumeAfter(text) {
        return text.replace(/after:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, (_, day, month, year) => {
            var _a, _b;
            const afterDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10) + 1);
            afterDate.setUTCHours(afterDate.getUTCHours() + afterDate.getTimezoneOffset() / 60 + ((_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.utcOffset) !== null && _b !== void 0 ? _b : 0));
            this.query.ts = Object.assign(Object.assign({}, this.query.ts), { $gte: afterDate });
            return '';
        });
    }
    /**
     * Filter on messages that have been sent on a date.
     */
    consumeOn(text) {
        return text.replace(/on:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, (_, day, month, year) => {
            var _a, _b;
            const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            date.setUTCHours(date.getUTCHours() + date.getTimezoneOffset() / 60 + ((_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.utcOffset) !== null && _b !== void 0 ? _b : 0));
            const dayAfter = new Date(date);
            dayAfter.setDate(dayAfter.getDate() + 1);
            this.query.ts = {
                $gte: date,
                $lt: dayAfter,
            };
            return '';
        });
    }
    /**
     * Sort by timestamp.
     */
    consumeOrder(text) {
        return text.replace(/(?:order|sort):(asc|ascend|ascending|desc|descend|descending)/g, (_, direction) => {
            if (direction.startsWith('asc')) {
                this.options.sort = Object.assign(Object.assign({}, (typeof this.options.sort === 'object' && !Array.isArray(this.options.sort) ? this.options.sort : {})), { ts: 1 });
            }
            else if (direction.startsWith('desc')) {
                this.options.sort = Object.assign(Object.assign({}, (typeof this.options.sort === 'object' && !Array.isArray(this.options.sort) ? this.options.sort : {})), { ts: -1 });
            }
            return '';
        });
    }
    /**
     * Query in message text
     */
    consumeMessageText(text) {
        text = text.trim().replace(/\s\s/g, ' ');
        if (text === '') {
            return text;
        }
        if (/^\/.+\/[imxs]*$/.test(text)) {
            const r = text.split('/');
            this.query.msg = {
                $regex: r[1],
                $options: r[2],
            };
        }
        else if (this.forceRegex) {
            this.query.msg = {
                $regex: text,
                $options: 'i',
            };
        }
        else {
            this.query.$text = {
                $search: text,
            };
            this.options.projection = {
                score: {
                    $meta: 'textScore',
                },
            };
        }
        return text;
    }
    parse(text) {
        [
            (input) => this.consumeFrom(input),
            (input) => this.consumeMention(input),
            (input) => this.consumeHasStar(input),
            (input) => this.consumeHasUrl(input),
            (input) => this.consumeIsPinned(input),
            (input) => this.consumeHasLocation(input),
            (input) => this.consumeLabel(input),
            (input) => this.consumeFileDescription(input),
            (input) => this.consumeFileTitle(input),
            (input) => this.consumeBefore(input),
            (input) => this.consumeAfter(input),
            (input) => this.consumeOn(input),
            (input) => this.consumeOrder(input),
            (input) => this.consumeMessageText(input),
        ].reduce((text, fn) => fn(text), text);
        return {
            query: this.query,
            options: this.options,
        };
    }
}
/**
 * Parses a message search query and returns a MongoDB query and options
 * @param text The query text
 * @param options The options
 * @param options.user The user object
 * @param options.offset The offset
 * @param options.limit The limit
 * @param options.forceRegex Whether to force the use of regex
 * @returns The MongoDB query and options
 * @private
 * @example
 * const { query, options } = parseMessageSearchQuery('from:rocket.cat', {
 * 	user: await Meteor.userAsync(),
 * 	offset: 0,
 * 	limit: 20,
 * 	forceRegex: false,
 * });
 */
function parseMessageSearchQuery(text, { user, offset = 0, limit = 20, forceRegex = false, }) {
    const parser = new MessageSearchQueryParser({ user, offset, limit, forceRegex });
    return parser.parse(text);
}
