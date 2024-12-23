"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarURL = void 0;
const getURL_1 = require("./getURL");
const getAvatarURL = ({ username, roomId, cache }) => {
    if (username) {
        return (0, getURL_1.getURL)(`/avatar/${encodeURIComponent(username)}${cache ? `?etag=${cache}` : ''}`);
    }
    if (roomId) {
        return (0, getURL_1.getURL)(`/avatar/room/${encodeURIComponent(roomId)}${cache ? `?etag=${cache}` : ''}`);
    }
};
exports.getAvatarURL = getAvatarURL;
