"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppAvatar;
const jsx_runtime_1 = require("react/jsx-runtime");
const BaseAvatar_1 = __importDefault(require("./BaseAvatar"));
function AppAvatar({ iconFileContent, iconFileData, size }) {
    return (0, jsx_runtime_1.jsx)(BaseAvatar_1.default, { size: size, url: iconFileContent || `data:image/png;base64,${iconFileData}` });
}
