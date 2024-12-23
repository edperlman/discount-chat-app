"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const RoomContext_1 = require("./contexts/RoomContext");
const RoomToolboxContext_1 = require("./contexts/RoomToolboxContext");
const RoomMembers_1 = __importDefault(require("./contextualBar/RoomMembers"));
const UserInfo_1 = __importDefault(require("./contextualBar/UserInfo"));
const getUid = (room, ownUserId) => {
    var _a, _b, _c;
    if (((_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        return room.uids[0];
    }
    const uid = (_b = room.uids) === null || _b === void 0 ? void 0 : _b.filter((uid) => uid !== ownUserId).shift();
    // Self DMs used to be created with the userId duplicated.
    // Sometimes rooms can have 2 equal uids, but it's a self DM.
    return uid || ((_c = room.uids) === null || _c === void 0 ? void 0 : _c[0]);
};
const MemberListRouter = () => {
    const { tab, context: username } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const isMembersList = (tab === null || tab === void 0 ? void 0 : tab.id) === 'members-list' || (tab === null || tab === void 0 ? void 0 : tab.id) === 'user-info-group';
    if (isMembersList && !username) {
        return (0, jsx_runtime_1.jsx)(RoomMembers_1.default, { rid: room._id });
    }
    return (0, jsx_runtime_1.jsx)(UserInfo_1.default, Object.assign({}, (username ? { username } : { uid: getUid(room, ownUserId) }), { onClose: closeTab, rid: room._id }));
};
exports.default = MemberListRouter;
