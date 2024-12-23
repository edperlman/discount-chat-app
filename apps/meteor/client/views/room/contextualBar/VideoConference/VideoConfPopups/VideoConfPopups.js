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
const ui_video_conf_1 = require("@rocket.chat/ui-video-conf");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const VideoConfPopup_1 = __importDefault(require("./VideoConfPopup"));
const VideoConfContext_1 = require("../../../../../contexts/VideoConfContext");
const VideoConfPopupPortal_1 = __importDefault(require("../../../../../portals/VideoConfPopupPortal"));
const VideoConfPopups = ({ children }) => {
    const customSound = (0, ui_contexts_1.useCustomSound)();
    const incomingCalls = (0, VideoConfContext_1.useVideoConfIncomingCalls)();
    const isRinging = (0, VideoConfContext_1.useVideoConfIsRinging)();
    const isCalling = (0, VideoConfContext_1.useVideoConfIsCalling)();
    const popups = (0, react_1.useMemo)(() => incomingCalls
        .filter((incomingCall) => !incomingCall.dismissed)
        .map((incomingCall) => ({ id: incomingCall.callId, rid: incomingCall.rid, isReceiving: true })), [incomingCalls]);
    (0, react_1.useEffect)(() => {
        if (isRinging) {
            customSound.play('ringtone', { loop: true });
        }
        if (isCalling) {
            customSound.play('dialtone', { loop: true });
        }
        return () => {
            customSound.stop('ringtone');
            customSound.stop('dialtone');
        };
    }, [customSound, isRinging, isCalling]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (children || (popups === null || popups === void 0 ? void 0 : popups.length) > 0) && ((0, jsx_runtime_1.jsx)(VideoConfPopupPortal_1.default, { children: (0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { autoFocus: true, contain: true, restoreFocus: true, children: (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupBackdrop, { children: (children ? [children, ...popups] : popups).map(({ id, rid, isReceiving }, index = 1) => ((0, jsx_runtime_1.jsx)(VideoConfPopup_1.default, { id: id, rid: rid, isReceiving: isReceiving, isCalling: isCalling, position: index * 10 }, id))) }) }) })) }));
};
exports.default = VideoConfPopups;
