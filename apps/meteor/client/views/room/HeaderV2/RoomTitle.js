"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const HeaderIconWithRoom_1 = __importDefault(require("./HeaderIconWithRoom"));
const Header_1 = require("../../../components/Header");
const RoomToolboxContext_1 = require("../contexts/RoomToolboxContext");
const RoomTitle = ({ room }) => {
    (0, ui_client_1.useDocumentTitle)(room.name, false);
    const { openTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const handleOpenRoomInfo = (0, fuselage_hooks_1.useEffectEvent)(() => {
        var _a, _b;
        if ((0, core_typings_1.isTeamRoom)(room)) {
            return openTab('team-info');
        }
        switch (room.t) {
            case 'l':
                openTab('room-info');
                break;
            case 'v':
                openTab('voip-room-info');
                break;
            case 'd':
                ((_b = (_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 2 ? openTab('user-info-group') : openTab('user-info');
                break;
            default:
                openTab('channel-settings');
                break;
        }
    });
    return ((0, jsx_runtime_1.jsxs)(Header_1.HeaderTitleButton, { onKeyDown: (e) => (e.code === 'Enter' || e.code === 'Space') && handleOpenRoomInfo(), onClick: () => handleOpenRoomInfo(), tabIndex: 0, role: 'button', children: [(0, jsx_runtime_1.jsx)(HeaderIconWithRoom_1.default, { room: room }), (0, jsx_runtime_1.jsx)(Header_1.HeaderTitle, { is: 'h1', children: room.name })] }));
};
exports.default = RoomTitle;
