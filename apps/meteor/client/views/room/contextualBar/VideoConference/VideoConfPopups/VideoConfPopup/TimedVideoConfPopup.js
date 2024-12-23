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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const IncomingPopup_1 = __importDefault(require("./IncomingPopup"));
const OutgoingPopup_1 = __importDefault(require("./OutgoingPopup"));
const StartCallPopup_1 = __importDefault(require("./StartCallPopup"));
const VideoConfContext_1 = require("../../../../../../contexts/VideoConfContext");
const TimedVideoConfPopup = ({ id, rid, isReceiving = false, isCalling = false, position, }) => {
    const [starting, setStarting] = (0, react_1.useState)(false);
    const acceptCall = (0, VideoConfContext_1.useVideoConfAcceptCall)();
    const abortCall = (0, VideoConfContext_1.useVideoConfAbortCall)();
    const rejectCall = (0, VideoConfContext_1.useVideoConfRejectIncomingCall)();
    const dismissCall = (0, VideoConfContext_1.useVideoConfDismissCall)();
    const startCall = (0, VideoConfContext_1.useVideoConfStartCall)();
    const dismissOutgoing = (0, VideoConfContext_1.useVideoConfDismissOutgoing)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    if (!room) {
        return null;
    }
    const handleConfirm = () => {
        acceptCall(id);
    };
    const handleClose = (id) => {
        if (isReceiving) {
            rejectCall(id);
            return;
        }
        abortCall();
    };
    const handleMute = () => {
        dismissCall(id);
    };
    const handleStartCall = () => __awaiter(void 0, void 0, void 0, function* () {
        setStarting(true);
        startCall(rid);
    });
    if (isReceiving) {
        return (0, jsx_runtime_1.jsx)(IncomingPopup_1.default, { room: room, id: id, position: position, onClose: handleClose, onMute: handleMute, onConfirm: handleConfirm });
    }
    if (isCalling) {
        return (0, jsx_runtime_1.jsx)(OutgoingPopup_1.default, { room: room, id: id, onClose: handleClose });
    }
    return (0, jsx_runtime_1.jsx)(StartCallPopup_1.default, { loading: starting, room: room, id: id, onClose: dismissOutgoing, onConfirm: handleStartCall });
};
exports.default = TimedVideoConfPopup;
