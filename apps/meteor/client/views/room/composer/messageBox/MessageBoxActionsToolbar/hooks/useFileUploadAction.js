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
exports.useFileUploadAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useFileInput_1 = require("../../../../../../hooks/useFileInput");
const ChatContext_1 = require("../../../../contexts/ChatContext");
const fileInputProps = { type: 'file', multiple: true };
const useFileUploadAction = (disabled) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const fileUploadEnabled = (0, ui_contexts_1.useSetting)('FileUpload_Enabled', true);
    const fileInputRef = (0, useFileInput_1.useFileInput)(fileInputProps);
    const chat = (0, ChatContext_1.useChat)();
    (0, react_1.useEffect)(() => {
        var _a;
        const resetFileInput = () => {
            if (!(fileInputRef === null || fileInputRef === void 0 ? void 0 : fileInputRef.current)) {
                return;
            }
            fileInputRef.current.value = '';
        };
        const handleUploadChange = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { getMimeType } = yield Promise.resolve().then(() => __importStar(require('../../../../../../../app/utils/lib/mimeTypes')));
            const filesToUpload = Array.from((_b = (_a = fileInputRef === null || fileInputRef === void 0 ? void 0 : fileInputRef.current) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []).map((file) => {
                Object.defineProperty(file, 'type', {
                    value: getMimeType(file.type, file.name),
                });
                return file;
            });
            chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles(filesToUpload, resetFileInput);
        });
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.addEventListener('change', handleUploadChange);
        return () => { var _a; return (_a = fileInputRef === null || fileInputRef === void 0 ? void 0 : fileInputRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('change', handleUploadChange); };
    }, [chat, fileInputRef]);
    const handleUpload = () => {
        var _a;
        (_a = fileInputRef === null || fileInputRef === void 0 ? void 0 : fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    return {
        id: 'file-upload',
        content: t('Upload_file'),
        icon: 'clip',
        onClick: handleUpload,
        disabled: !fileUploadEnabled || disabled,
    };
};
exports.useFileUploadAction = useFileUploadAction;
