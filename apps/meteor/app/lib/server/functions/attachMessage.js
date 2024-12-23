"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachMessage = void 0;
const getUserDisplayName_1 = require("../../../../lib/getUserDisplayName");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const cached_1 = require("../../../settings/server/cached");
const getUserAvatarURL_1 = require("../../../utils/server/getUserAvatarURL");
const attachMessage = function (message, room) {
    const useRealName = Boolean(cached_1.settings.get('UI_Use_Real_Name'));
    const { msg, u: { username, name }, ts, attachments, _id, } = message;
    return {
        text: msg,
        author_name: (0, getUserDisplayName_1.getUserDisplayName)(name, username, useRealName),
        author_icon: (0, getUserAvatarURL_1.getUserAvatarURL)(username),
        message_link: `${roomCoordinator_1.roomCoordinator.getRouteLink(room.t, room)}?msg=${_id}`,
        attachments,
        ts,
    };
};
exports.attachMessage = attachMessage;
