"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const UserStatus_1 = require("../components/UserStatus");
const useRoomIcon = (room) => {
    var _a;
    if ((0, core_typings_1.isRoomFederated)(room)) {
        return { name: 'globe' };
    }
    if (room.prid) {
        return { name: 'baloons' };
    }
    if (room.teamMain) {
        return { name: room.t === 'p' ? 'team-lock' : 'team' };
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        if (room.uids && room.uids.length > 2) {
            return { name: 'balloon' };
        }
        if (room.uids && room.uids.length > 0) {
            const uid = room.uids.find((uid) => { var _a; return uid !== ((_a = room === null || room === void 0 ? void 0 : room.u) === null || _a === void 0 ? void 0 : _a._id); }) || ((_a = room === null || room === void 0 ? void 0 : room.u) === null || _a === void 0 ? void 0 : _a._id);
            if (!uid) {
                return null;
            }
            return (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: uid });
        }
        return { name: 'at' };
    }
    switch (room.t) {
        case 'p':
            return { name: 'hashtag-lock' };
        case 'c':
            return { name: 'hash' };
        default:
            return null;
    }
};
exports.useRoomIcon = useRoomIcon;
