"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.ButtonGroup = (0, compat_1.memo)(({ children, full = false }) => ((0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'button-group', { full }), children: (0, preact_1.toChildArray)(children).map((child) => (0, preact_1.isValidElement)(child) ? (0, preact_1.cloneElement)(child, { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'button-group__item') }) : child) })));
