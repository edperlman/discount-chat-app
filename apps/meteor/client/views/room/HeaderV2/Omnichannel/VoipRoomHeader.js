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
const shim_1 = require("use-sync-external-store/shim");
const Header_1 = require("../../../../components/Header");
const SidebarToggler_1 = __importDefault(require("../../../../components/SidebarToggler"));
const parseOutboundPhoneNumber_1 = require("../../../../lib/voip/parseOutboundPhoneNumber");
const RoomHeader_1 = __importDefault(require("../RoomHeader"));
const BackButton_1 = __importDefault(require("./BackButton"));
const VoipRoomHeader = ({ slots: parentSlot, room }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const currentRouteName = (0, shim_1.useSyncExternalStore)(router.subscribeToRouteChange, (0, react_1.useCallback)(() => router.getRouteName(), [router]));
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    const slots = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, parentSlot), { start: (!!isMobile || currentRouteName === 'omnichannel-directory') && ((0, jsx_runtime_1.jsxs)(Header_1.HeaderToolbar, { children: [isMobile && (0, jsx_runtime_1.jsx)(SidebarToggler_1.default, {}), currentRouteName === 'omnichannel-directory' && (0, jsx_runtime_1.jsx)(BackButton_1.default, {})] })) })), [isMobile, currentRouteName, parentSlot]);
    return (0, jsx_runtime_1.jsx)(RoomHeader_1.default, { slots: slots, room: Object.assign(Object.assign({}, room), { name: (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(room.fname) }) });
};
exports.default = VoipRoomHeader;
