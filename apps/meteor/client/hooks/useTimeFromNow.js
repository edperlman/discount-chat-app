"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeFromNow = void 0;
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const useTimeFromNow = (withSuffix) => (0, react_1.useCallback)((date) => (0, moment_1.default)(date).fromNow(!withSuffix), [withSuffix]);
exports.useTimeFromNow = useTimeFromNow;
