"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomTypeTranslation = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const i18n_1 = require("../../app/utils/lib/i18n");
const getRoomTypeTranslation = (room) => {
    if ((0, core_typings_1.isPublicRoom)(room)) {
        return (0, i18n_1.t)('Channel');
    }
    if ((0, core_typings_1.isPrivateDiscussion)(room)) {
        return (0, i18n_1.t)('Private_Discussion');
    }
    if ((0, core_typings_1.isPrivateRoom)(room)) {
        return (0, i18n_1.t)('Private_Group');
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return (0, i18n_1.t)('Direct_Message');
    }
    if ((0, core_typings_1.isPrivateTeamRoom)(room)) {
        return (0, i18n_1.t)('Teams_Private_Team');
    }
    if ((0, core_typings_1.isPublicTeamRoom)(room)) {
        return (0, i18n_1.t)('Teams_Public_Team');
    }
    return (0, i18n_1.t)('Room');
};
exports.getRoomTypeTranslation = getRoomTypeTranslation;
