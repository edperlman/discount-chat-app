"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../../../../components/Header");
const ui_1 = require("../../../../ui");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const getRoomGroup_1 = require("../../lib/getRoomGroup");
const RoomToolboxE2EESetup = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const toolbox = (0, RoomToolboxContext_1.useRoomToolbox)();
    const room = (0, RoomContext_1.useRoom)();
    const { tab } = toolbox;
    const actions = (0, fuselage_hooks_1.useStableArray)(ui_1.roomActionHooksForE2EESetup
        .map((roomActionHook) => roomActionHook())
        .filter((roomAction) => !!roomAction && (!roomAction.groups || roomAction.groups.includes((0, getRoomGroup_1.getRoomGroup)(room)))));
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: actions.map(({ id, icon, title, action, disabled, tooltip }, index) => ((0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, { index: index, id: id, icon: icon, title: t(title), pressed: id === (tab === null || tab === void 0 ? void 0 : tab.id), action: action !== null && action !== void 0 ? action : (() => toolbox.openTab(id)), disabled: disabled, tooltip: tooltip }, id))) }));
};
exports.default = RoomToolboxE2EESetup;
