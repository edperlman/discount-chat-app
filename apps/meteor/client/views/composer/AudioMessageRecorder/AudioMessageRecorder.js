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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AudioRecorder_1 = require("../../../../app/ui/client/lib/recorderjs/AudioRecorder");
const ChatContext_1 = require("../../room/contexts/ChatContext");
const audioRecorder = new AudioRecorder_1.AudioRecorder();
const AudioMessageRecorder = ({ rid, chatContext, isMicrophoneDenied }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [state, setState] = (0, react_1.useState)('recording');
    const [time, setTime] = (0, react_1.useState)('00:00');
    const [recordingInterval, setRecordingInterval] = (0, react_1.useState)(null);
    const [recordingRoomId, setRecordingRoomId] = (0, react_1.useState)(null);
    const stopRecording = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (recordingInterval) {
            clearInterval(recordingInterval);
        }
        setRecordingInterval(null);
        setRecordingRoomId(null);
        setTime('00:00');
        chat === null || chat === void 0 ? void 0 : chat.action.stop('recording');
        (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingMode(false);
        const blob = yield new Promise((resolve) => audioRecorder.stop(resolve));
        return blob;
    }));
    const handleUnmount = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (state === 'recording') {
            yield stopRecording();
        }
    }));
    const handleRecord = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (recordingRoomId && recordingRoomId !== rid) {
            return;
        }
        try {
            yield audioRecorder.start();
            chat === null || chat === void 0 ? void 0 : chat.action.performContinuously('recording');
            const startTime = new Date();
            setRecordingInterval(setInterval(() => {
                const now = new Date();
                const distance = (now.getTime() - startTime.getTime()) / 1000;
                const minutes = Math.floor(distance / 60);
                const seconds = Math.floor(distance % 60);
                setTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }, 1000));
            setRecordingRoomId(rid);
        }
        catch (error) {
            console.log(error);
            (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingMode(false);
        }
    }));
    const handleCancelButtonClick = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield stopRecording();
    }));
    const chat = (_a = (0, ChatContext_1.useChat)()) !== null && _a !== void 0 ? _a : chatContext;
    const handleDoneButtonClick = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setState('loading');
        const blob = yield stopRecording();
        const fileName = `${t('Audio_record')}.mp3`;
        const file = new File([blob], fileName, { type: 'audio/mpeg' });
        yield (chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles([file]));
    }));
    (0, react_1.useEffect)(() => {
        handleRecord();
        return () => {
            handleUnmount();
        };
    }, [handleUnmount, handleRecord]);
    if (isMicrophoneDenied) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', position: 'absolute', color: 'default', pi: 4, pb: 12, children: [state === 'recording' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'circle-cross', title: t('Cancel_recording'), onClick: handleCancelButtonClick }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', mi: 4, justifyContent: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'rec', color: 'red' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mis: 4, is: 'span', minWidth: 'x40', children: time })] }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'circle-check', title: t('Finish_recording'), onClick: handleDoneButtonClick })] })), state === 'loading' && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { inheritColor: true, size: 'x12' })] }));
};
exports.default = AudioMessageRecorder;
