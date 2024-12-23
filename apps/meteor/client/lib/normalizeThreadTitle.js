"use strict";
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
exports.normalizeThreadTitle = normalizeThreadTitle;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const emojiParser_1 = require("../../app/emoji/client/emojiParser");
const markdown_1 = require("../../app/markdown/lib/markdown");
const MentionsParser_1 = require("../../app/mentions/lib/MentionsParser");
const client_1 = require("../../app/models/client");
const client_2 = require("../../app/settings/client");
function normalizeThreadTitle(_a) {
    var _b;
    var message = __rest(_a, []);
    if (message.msg) {
        const filteredMessage = (0, markdown_1.filterMarkdown)((0, string_helpers_1.escapeHTML)(message.msg));
        if (!message.channels && !message.mentions) {
            return filteredMessage;
        }
        const uid = meteor_1.Meteor.userId();
        const me = (uid && ((_b = client_1.Users.findOne(uid, { fields: { username: 1 } })) === null || _b === void 0 ? void 0 : _b.username)) || '';
        const pattern = client_2.settings.get('UTF8_User_Names_Validation');
        const useRealName = client_2.settings.get('UI_Use_Real_Name');
        const instance = new MentionsParser_1.MentionsParser({
            pattern: () => pattern,
            useRealName: () => useRealName,
            me: () => me,
            userTemplate: ({ label }) => `<strong> ${label} </strong>`,
            roomTemplate: ({ prefix, mention }) => `${prefix}<strong> ${mention} </strong>`,
        });
        const html = (0, emojiParser_1.emojiParser)(filteredMessage);
        return instance.parse(Object.assign(Object.assign({}, message), { msg: filteredMessage, html })).html;
    }
    if (message.attachments) {
        const attachment = message.attachments.find((attachment) => attachment.title || attachment.description);
        if (attachment === null || attachment === void 0 ? void 0 : attachment.description) {
            return (0, string_helpers_1.escapeHTML)(attachment.description);
        }
        if (attachment === null || attachment === void 0 ? void 0 : attachment.title) {
            return (0, string_helpers_1.escapeHTML)(attachment.title);
        }
    }
}
