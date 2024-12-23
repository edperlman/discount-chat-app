"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomAccessAttributes = exports.canAccessRoomIdAsync = exports.canAccessRoomAsync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
exports.canAccessRoomAsync = core_services_1.Authorization.canAccessRoom;
exports.canAccessRoomIdAsync = core_services_1.Authorization.canAccessRoomId;
exports.roomAccessAttributes = {
    _id: 1,
    t: 1,
    teamId: 1,
    prid: 1,
};
