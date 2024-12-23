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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileUploadDropTarget = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useDropTarget_1 = require("./useDropTarget");
const useIsRoomOverMacLimit_1 = require("../../../../hooks/omnichannel/useIsRoomOverMacLimit");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const ChatContext_1 = require("../../contexts/ChatContext");
const RoomContext_1 = require("../../contexts/RoomContext");
const useFileUploadDropTarget = () => {
    const room = (0, RoomContext_1.useRoom)();
    const { triggerProps, overlayProps } = (0, useDropTarget_1.useDropTarget)();
    const isRoomOverMacLimit = (0, useIsRoomOverMacLimit_1.useIsRoomOverMacLimit)(room);
    const t = (0, ui_contexts_1.useTranslation)();
    const fileUploadEnabled = (0, ui_contexts_1.useSetting)('FileUpload_Enabled', true);
    const user = (0, ui_contexts_1.useUser)();
    const fileUploadAllowedForUser = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => !roomCoordinator_1.roomCoordinator.readOnly(room._id, { username: user === null || user === void 0 ? void 0 : user.username }), [room._id, user === null || user === void 0 ? void 0 : user.username]));
    const chat = (0, ChatContext_1.useChat)();
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const onFileDrop = (0, fuselage_hooks_1.useMutableCallback)((files) => __awaiter(void 0, void 0, void 0, function* () {
        const { getMimeType } = yield Promise.resolve().then(() => __importStar(require('../../../../../app/utils/lib/mimeTypes')));
        const getUniqueFiles = () => {
            const uniqueFiles = [];
            const st = new Set();
            files.forEach((file) => {
                const key = file.size;
                if (!st.has(key)) {
                    uniqueFiles.push(file);
                    st.add(key);
                }
            });
            return uniqueFiles;
        };
        const uniqueFiles = getUniqueFiles();
        const uploads = Array.from(uniqueFiles).map((file) => {
            Object.defineProperty(file, 'type', { value: getMimeType(file.type, file.name) });
            return file;
        });
        chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles(uploads);
    }));
    const allOverlayProps = (0, react_1.useMemo)(() => {
        if (!fileUploadEnabled || isRoomOverMacLimit) {
            return Object.assign({ enabled: false, reason: t('FileUpload_Disabled') }, overlayProps);
        }
        if (!fileUploadAllowedForUser || !subscription) {
            return Object.assign({ enabled: false, reason: t('error-not-allowed') }, overlayProps);
        }
        return Object.assign({ enabled: true, onFileDrop }, overlayProps);
    }, [fileUploadAllowedForUser, fileUploadEnabled, isRoomOverMacLimit, onFileDrop, overlayProps, subscription, t]);
    return [triggerProps, allOverlayProps];
};
exports.useFileUploadDropTarget = useFileUploadDropTarget;
