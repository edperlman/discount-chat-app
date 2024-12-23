"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatTime = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const dayFormat = ['h:mm A', 'H:mm'];
const useFormatTime = () => {
    const clockMode = (0, ui_contexts_1.useUserPreference)('clockMode');
    const format = (0, ui_contexts_1.useSetting)('Message_TimeFormat', 'LT');
    const sameDay = clockMode !== undefined ? dayFormat[clockMode - 1] : format;
    return (0, react_1.useCallback)((time) => {
        switch (clockMode) {
            case 1:
            case 2:
                return (0, moment_1.default)(time).format(sameDay);
            default:
                return (0, moment_1.default)(time).format(format);
        }
    }, [clockMode, format, sameDay]);
};
exports.useFormatTime = useFormatTime;
