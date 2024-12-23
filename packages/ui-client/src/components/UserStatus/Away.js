"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const UserStatus_1 = __importDefault(require("./UserStatus"));
function Away(props) {
    return (0, jsx_runtime_1.jsx)(UserStatus_1.default, Object.assign({ status: 'away' }, props));
}
exports.default = Away;
