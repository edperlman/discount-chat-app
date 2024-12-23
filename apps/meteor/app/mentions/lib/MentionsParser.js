"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionsParser = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const userTemplateDefault = ({ prefix, className, mention, title = '', label, type = 'username', }) => `${prefix}<a class="${className}" data-${type}="${mention}"${title ? ` title="${title}"` : ''}>${label}</a>`;
const roomTemplateDefault = ({ prefix, reference, mention }) => `${prefix}<a class="mention-link mention-link--room" data-channel="${reference}">${`#${mention}`}</a>`;
class MentionsParser {
    constructor({ pattern, useRealName, me, roomTemplate = roomTemplateDefault, userTemplate = userTemplateDefault }) {
        this.replaceUsers = (msg, { mentions, temp }, me) => msg.replace(this.userMentionRegex, (match, prefix, mention) => {
            const classNames = ['mention-link'];
            if (mention === 'all') {
                classNames.push('mention-link--all');
                classNames.push('mention-link--group');
            }
            else if (mention === 'here') {
                classNames.push('mention-link--here');
                classNames.push('mention-link--group');
            }
            else if (mention === me) {
                classNames.push('mention-link--me');
                classNames.push('mention-link--user');
            }
            else {
                classNames.push('mention-link--user');
            }
            const className = classNames.join(' ');
            if (mention === 'all' || mention === 'here') {
                return this.userTemplate({ prefix, className, mention, label: mention, type: 'group' });
            }
            const filterUser = ({ username, type }) => (!type || type === 'user') && username === mention;
            const filterTeam = ({ name, type }) => type === 'team' && name === mention;
            const [mentionObj] = (mentions || []).filter((m) => m && (filterUser(m) || filterTeam(m)));
            const label = temp
                ? mention && (0, string_helpers_1.escapeHTML)(mention)
                : mentionObj && (0, string_helpers_1.escapeHTML)((mentionObj.type === 'team' || this.useRealName() ? mentionObj.name : mentionObj.username) || '');
            if (!label) {
                return match;
            }
            return this.userTemplate({
                prefix,
                className,
                mention,
                label,
                type: (mentionObj === null || mentionObj === void 0 ? void 0 : mentionObj.type) === 'team' ? 'team' : 'username',
                title: this.useRealName() ? mention : label,
            });
        });
        this.replaceChannels = (msg, { temp, channels }) => msg.replace(/&#39;/g, "'").replace(this.channelMentionRegex, (match, prefix, mention) => {
            if (!temp &&
                !(channels === null || channels === void 0 ? void 0 : channels.find((c) => {
                    return c.name === mention;
                }))) {
                return match;
            }
            const channel = channels === null || channels === void 0 ? void 0 : channels.find(({ name }) => {
                return name === mention;
            });
            const reference = channel ? channel._id : mention;
            return this.roomTemplate({ prefix, reference, channel, mention });
        });
        this.pattern = pattern;
        this.useRealName = useRealName || (() => false);
        this.me = me || (() => '');
        this.userTemplate = userTemplate;
        this.roomTemplate = roomTemplate;
    }
    get userMentionRegex() {
        return new RegExp(`(^|\\s|>)@(${this.pattern()}(@(${this.pattern()}))?(:([0-9a-zA-Z-_.]+))?)`, 'gm');
    }
    get channelMentionRegex() {
        return new RegExp(`(^|\\s|>)#(${this.pattern()}(@(${this.pattern()}))?)`, 'gm');
    }
    getUserMentions(msg) {
        // First remove the text inside md links
        const str = msg.replace(/\[[^\]]*\]\([^)]+\)/g, '');
        // Then do the match
        return (str.match(this.userMentionRegex) || []).map((match) => match.trim());
    }
    getChannelMentions(msg) {
        // First remove the text inside md links
        const str = msg.replace(/\[[^\]]*\]\([^)]+\)/g, '');
        // Then do the match
        return (str.match(this.channelMentionRegex) || []).map((match) => match.trim());
    }
    parse(message) {
        let msg = (message === null || message === void 0 ? void 0 : message.html) || '';
        if (!msg.trim()) {
            return message;
        }
        msg = this.replaceUsers(msg, message, this.me());
        msg = this.replaceChannels(msg, message);
        message.html = msg;
        return message;
    }
}
exports.MentionsParser = MentionsParser;
