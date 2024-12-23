"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatDate = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const useFormatDate = () => {
    const format = (0, ui_contexts_1.useSetting)('Message_DateFormat');
    return (0, react_1.useCallback)((time) => (0, moment_1.default)(time).format(String(format)), [format]);
};
exports.useFormatDate = useFormatDate;
