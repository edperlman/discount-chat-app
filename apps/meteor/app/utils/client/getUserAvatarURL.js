"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAvatarURL = void 0;
const getAvatarURL_1 = require("./getAvatarURL");
const getUserAvatarURL = function (username, cache = '') {
    if (username == null) {
        return;
    }
    return (0, getAvatarURL_1.getAvatarURL)({ username, cache });
};
exports.getUserAvatarURL = getUserAvatarURL;
