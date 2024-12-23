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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const Header_1 = require("../../../components/Header");
const SidebarToggler_1 = __importDefault(require("../../../components/SidebarToggler"));
const OmnichannelRoomHeader = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./Omnichannel/OmnichannelRoomHeader'))));
const VoipRoomHeader = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./Omnichannel/VoipRoomHeader'))));
const RoomHeaderE2EESetup = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./RoomHeaderE2EESetup'))));
const RoomHeader = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./RoomHeader'))));
const Header = ({ room }) => {
    const { isMobile, isEmbedded, showTopNavbarEmbeddedLayout } = (0, ui_contexts_1.useLayout)();
    const encrypted = Boolean(room.encrypted);
    const unencryptedMessagesAllowed = (0, ui_contexts_1.useSetting)('E2E_Allow_Unencrypted_Messages', false);
    const shouldDisplayE2EESetup = encrypted && !unencryptedMessagesAllowed;
    const slots = (0, react_1.useMemo)(() => ({
        start: isMobile && ((0, jsx_runtime_1.jsx)(Header_1.HeaderToolbar, { children: (0, jsx_runtime_1.jsx)(SidebarToggler_1.default, {}) })),
    }), [isMobile]);
    if (isEmbedded && !showTopNavbarEmbeddedLayout) {
        return null;
    }
    if (room.t === 'l') {
        return (0, jsx_runtime_1.jsx)(OmnichannelRoomHeader, { slots: slots });
    }
    if ((0, core_typings_1.isVoipRoom)(room)) {
        return (0, jsx_runtime_1.jsx)(VoipRoomHeader, { slots: slots, room: room });
    }
    if (shouldDisplayE2EESetup) {
        return (0, jsx_runtime_1.jsx)(RoomHeaderE2EESetup, { room: room, slots: slots });
    }
    return (0, jsx_runtime_1.jsx)(RoomHeader, { slots: slots, room: room });
};
exports.default = (0, react_1.memo)(Header);
