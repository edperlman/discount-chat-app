"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.MessageContainer = (0, compat_1.memo)(
// TODO: find a better way to pass `use` and do not default to a string
// eslint-disable-next-line @typescript-eslint/naming-convention
({ id, compact, reverse, use: Element = 'div', className, style = {}, children, system = false }) => ((0, jsx_runtime_1.jsx)(Element, { id: id, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-container', { compact, reverse, system }, [className]), style: style, children: children })));
