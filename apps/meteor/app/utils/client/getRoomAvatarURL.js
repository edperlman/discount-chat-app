"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomAvatarURL = void 0;
const getAvatarURL_1 = require("./getAvatarURL");
const client_1 = require("../../settings/client");
const getRoomAvatarURL = ({ roomId, cache = '' }) => {
    const externalSource = (client_1.settings.get('Accounts_RoomAvatarExternalProviderUrl') || '').trim().replace(/\/$/, '');
    if (externalSource && typeof externalSource === 'string') {
        return externalSource.replace('{roomId}', roomId);
    }
    if (!roomId) {
        return;
    }
    return (0, getAvatarURL_1.getAvatarURL)({ roomId, cache });
};
exports.getRoomAvatarURL = getRoomAvatarURL;
