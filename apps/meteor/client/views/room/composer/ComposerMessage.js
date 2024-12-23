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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ComposerSkeleton_1 = __importDefault(require("./ComposerSkeleton"));
const client_1 = require("../../../../app/ui-utils/client");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const ChatContext_1 = require("../contexts/ChatContext");
const RoomContext_1 = require("../contexts/RoomContext");
const MessageBox_1 = __importDefault(require("./messageBox/MessageBox"));
const ComposerMessage = (_a) => {
    var _b;
    var { tmid, onSend } = _a, props = __rest(_a, ["tmid", "onSend"]);
    const chat = (0, ChatContext_1.useChat)();
    const room = (0, RoomContext_1.useRoom)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const composerProps = (0, react_1.useMemo)(() => ({
        onJoin: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                yield ((_a = chat === null || chat === void 0 ? void 0 : chat.data) === null || _a === void 0 ? void 0 : _a.joinRoom());
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
                throw error;
            }
        }),
        onSend: (_a) => __awaiter(void 0, [_a], void 0, function* ({ value: text, tshow, previewUrls, isSlashCommandAllowed, }) {
            try {
                yield (chat === null || chat === void 0 ? void 0 : chat.action.stop('typing'));
                const newMessageSent = yield (chat === null || chat === void 0 ? void 0 : chat.flows.sendMessage({
                    text,
                    tshow,
                    previewUrls,
                    isSlashCommandAllowed,
                }));
                if (newMessageSent)
                    onSend === null || onSend === void 0 ? void 0 : onSend();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
        }),
        onTyping: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (((_b = (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim()) === '') {
                yield (chat === null || chat === void 0 ? void 0 : chat.action.stop('typing'));
                return;
            }
            yield (chat === null || chat === void 0 ? void 0 : chat.action.start('typing'));
        }),
        onNavigateToPreviousMessage: () => chat === null || chat === void 0 ? void 0 : chat.messageEditing.toPreviousMessage(),
        onNavigateToNextMessage: () => chat === null || chat === void 0 ? void 0 : chat.messageEditing.toNextMessage(),
        onUploadFiles: (files) => {
            return chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles(files);
        },
    }), [chat === null || chat === void 0 ? void 0 : chat.data, chat === null || chat === void 0 ? void 0 : chat.flows, chat === null || chat === void 0 ? void 0 : chat.action, (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.text, chat === null || chat === void 0 ? void 0 : chat.messageEditing, dispatchToastMessage, onSend]);
    const publicationReady = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => { var _a, _b; return (_b = (_a = client_1.LegacyRoomManager.getOpenedRoomByRid(room._id)) === null || _a === void 0 ? void 0 : _a.streamActive) !== null && _b !== void 0 ? _b : false; }, [room._id]));
    if (!publicationReady) {
        return (0, jsx_runtime_1.jsx)(ComposerSkeleton_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(MessageBox_1.default, Object.assign({ tmid: tmid }, composerProps, { showFormattingTips: true }, props), room._id);
};
exports.default = (0, react_1.memo)(ComposerMessage);
