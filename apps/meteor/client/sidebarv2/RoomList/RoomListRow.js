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
const react_1 = __importStar(require("react"));
const SidebarItemTemplateWithData_1 = __importDefault(require("./SidebarItemTemplateWithData"));
const VideoConfContext_1 = require("../../contexts/VideoConfContext");
const RoomListRow = ({ data, item }) => {
    const { extended, t, SidebarItemTemplate, AvatarTemplate, openedRoom, sidebarViewMode } = data;
    const acceptCall = (0, VideoConfContext_1.useVideoConfAcceptCall)();
    const rejectCall = (0, VideoConfContext_1.useVideoConfRejectIncomingCall)();
    const incomingCalls = (0, VideoConfContext_1.useVideoConfIncomingCalls)();
    const currentCall = incomingCalls.find((call) => call.rid === item.rid);
    const videoConfActions = (0, react_1.useMemo)(() => currentCall && {
        acceptCall: () => acceptCall(currentCall.callId),
        rejectCall: () => rejectCall(currentCall.callId),
    }, [acceptCall, rejectCall, currentCall]);
    return ((0, jsx_runtime_1.jsx)(SidebarItemTemplateWithData_1.default, { sidebarViewMode: sidebarViewMode, selected: item.rid === openedRoom, t: t, room: item, extended: extended, SidebarItemTemplate: SidebarItemTemplate, AvatarTemplate: AvatarTemplate, videoConfActions: videoConfActions }));
};
exports.default = (0, react_1.memo)(RoomListRow);
