"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ChatInfo_1 = __importDefault(require("./ChatInfo"));
const RoomEdit_1 = __importDefault(require("./RoomEdit"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const RoomContext_1 = require("../../../../room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../../room/contexts/RoomToolboxContext");
const PATH = 'live';
const HEADER_DATA = {
    info: { icon: 'info-circled', title: 'Room_Info' },
    edit: { icon: 'pencil', title: 'edit-room' },
};
const ChatsContextualBar = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const directoryRoute = (0, ui_contexts_1.useRoute)(PATH);
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const handleRoomEditBarCloseButtonClick = () => {
        directoryRoute.push({ id: room._id, tab: 'room-info' });
    };
    const { icon, title } = (0, react_1.useMemo)(() => HEADER_DATA[context !== null && context !== void 0 ? context : 'info'] || HEADER_DATA.info, [context]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: icon }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t(title) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: closeTab })] }), context === 'edit' ? ((0, jsx_runtime_1.jsx)(RoomEdit_1.default, { id: room._id, onClose: handleRoomEditBarCloseButtonClick })) : ((0, jsx_runtime_1.jsx)(ChatInfo_1.default, { route: PATH, id: room._id }))] }));
};
exports.default = ChatsContextualBar;
