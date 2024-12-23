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
exports.normalizeMessagesForUser = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../settings/server");
const filterStarred = (message, uid) => {
    // if Allow_anonymous_read is enabled, uid will be undefined
    if (!uid)
        return message;
    // only return starred field if user has it starred
    if (message.starred && Array.isArray(message.starred)) {
        message.starred = message.starred.filter((star) => star._id === uid);
    }
    return message;
};
// TODO: we should let clients get user names on demand instead of doing this
function getNameOfUsername(users, username) {
    return users.get(username) || username;
}
const normalizeMessagesForUser = (messages, uid) => __awaiter(void 0, void 0, void 0, function* () {
    // if not using real names, there is nothing else to do
    if (!server_1.settings.get('UI_Use_Real_Name')) {
        return messages.map((message) => filterStarred(message, uid));
    }
    const usernames = new Set();
    messages.forEach((message) => {
        var _a;
        message = filterStarred(message, uid);
        if (!((_a = message.u) === null || _a === void 0 ? void 0 : _a.username)) {
            return;
        }
        usernames.add(message.u.username);
        (message.mentions || []).forEach(({ username }) => {
            if (username) {
                usernames.add(username);
            }
        });
        Object.values(message.reactions || {}).forEach((reaction) => reaction.usernames.forEach((username) => usernames.add(username)));
    });
    const names = new Map();
    (yield models_1.Users.findUsersByUsernames([...usernames.values()], {
        projection: {
            username: 1,
            name: 1,
        },
    }).toArray()).forEach((user) => {
        names.set(user.username, user.name);
    });
    messages.forEach((message) => {
        if (!message.u) {
            return;
        }
        message.u.name = getNameOfUsername(names, message.u.username);
        (message.mentions || []).forEach((mention) => {
            if (mention.username) {
                mention.name = getNameOfUsername(names, mention.username);
            }
        });
        if (!message.reactions) {
            return messages;
        }
        message.reactions = Object.fromEntries(Object.entries(message.reactions).map(([keys, reaction]) => {
            reaction.names = reaction.usernames.map((username) => getNameOfUsername(names, username));
            return [keys, reaction];
        }));
    });
    return messages;
});
exports.normalizeMessagesForUser = normalizeMessagesForUser;
