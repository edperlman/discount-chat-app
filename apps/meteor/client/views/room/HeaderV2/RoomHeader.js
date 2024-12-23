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
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const FederatedRoomOriginServer_1 = __importDefault(require("./FederatedRoomOriginServer"));
const ParentRoomWithData_1 = __importDefault(require("./ParentRoomWithData"));
const ParentTeam_1 = __importDefault(require("./ParentTeam"));
const RoomTitle_1 = __importDefault(require("./RoomTitle"));
const RoomToolbox_1 = __importDefault(require("./RoomToolbox"));
const Encrypted_1 = __importDefault(require("./icons/Encrypted"));
const Favorite_1 = __importDefault(require("./icons/Favorite"));
const Translate_1 = __importDefault(require("./icons/Translate"));
const Header_1 = require("../../../components/Header");
const RoomHeader = ({ room, slots = {}, roomToolbox }) => {
    var _a, _b, _c;
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Header_1.Header, { children: [slots === null || slots === void 0 ? void 0 : slots.start, (0, jsx_runtime_1.jsx)(Header_1.HeaderAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { room: room, size: 'x28' }) }), slots === null || slots === void 0 ? void 0 : slots.preContent, (0, jsx_runtime_1.jsx)(Header_1.HeaderContent, { children: (0, jsx_runtime_1.jsxs)(Header_1.HeaderContentRow, { children: [(0, jsx_runtime_1.jsx)(RoomTitle_1.default, { room: room }), (0, jsx_runtime_1.jsx)(Favorite_1.default, { room: room }), room.prid && (0, jsx_runtime_1.jsx)(ParentRoomWithData_1.default, { room: room }), room.teamId && !room.teamMain && (0, jsx_runtime_1.jsx)(ParentTeam_1.default, { room: room }), (0, core_typings_1.isRoomFederated)(room) && (0, jsx_runtime_1.jsx)(FederatedRoomOriginServer_1.default, { room: room }), (0, jsx_runtime_1.jsx)(Encrypted_1.default, { room: room }), (0, jsx_runtime_1.jsx)(Translate_1.default, { room: room }), slots === null || slots === void 0 ? void 0 : slots.insideContent] }) }), slots === null || slots === void 0 ? void 0 : slots.posContent, (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: (0, jsx_runtime_1.jsxs)(Header_1.HeaderToolbar, { "aria-label": t('Toolbox_room_actions'), children: [(_a = slots === null || slots === void 0 ? void 0 : slots.toolbox) === null || _a === void 0 ? void 0 : _a.pre, ((_b = slots === null || slots === void 0 ? void 0 : slots.toolbox) === null || _b === void 0 ? void 0 : _b.content) || roomToolbox || (0, jsx_runtime_1.jsx)(RoomToolbox_1.default, {}), (_c = slots === null || slots === void 0 ? void 0 : slots.toolbox) === null || _c === void 0 ? void 0 : _c.pos] }) }), slots === null || slots === void 0 ? void 0 : slots.end] }));
};
exports.default = RoomHeader;
