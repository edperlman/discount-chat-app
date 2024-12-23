"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatDateAndTime = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const useFormatDateAndTime = ({ withSeconds } = {}) => {
    const clockMode = (0, ui_contexts_1.useUserPreference)('clockMode');
    const format = (0, ui_contexts_1.useSetting)('Message_TimeAndDateFormat', 'LLL');
    return (0, react_1.useCallback)((time) => {
        switch (clockMode) {
            case 1:
                return (0, moment_1.default)(time).format(withSeconds ? 'MMMM D, Y h:mm:ss A' : 'MMMM D, Y h:mm A');
            case 2:
                return (0, moment_1.default)(time).format(withSeconds ? 'MMMM D, Y H:mm:ss' : 'MMMM D, Y H:mm');
            default:
                return (0, moment_1.default)(time).format(withSeconds ? 'L LTS' : format);
        }
    }, [clockMode, format, withSeconds]);
};
exports.useFormatDateAndTime = useFormatDateAndTime;
