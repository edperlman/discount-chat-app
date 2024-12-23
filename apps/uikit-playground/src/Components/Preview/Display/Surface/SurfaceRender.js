"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const BannerSurface_1 = __importDefault(require("./BannerSurface"));
const MessageSurface_1 = __importDefault(require("./MessageSurface"));
const ModalSurface_1 = __importDefault(require("./ModalSurface"));
const constant_1 = require("./constant");
const ContextualBarSurface_1 = __importDefault(require("./ContextualBarSurface"));
const SurfaceRender = ({ type = constant_1.SurfaceOptions.Message, children, }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [constant_1.SurfaceOptions.Message === type && ((0, jsx_runtime_1.jsx)(MessageSurface_1.default, { children: children })), constant_1.SurfaceOptions.Banner === type && ((0, jsx_runtime_1.jsx)(BannerSurface_1.default, { children: children })), constant_1.SurfaceOptions.Modal === type && (0, jsx_runtime_1.jsx)(ModalSurface_1.default, { children: children }), constant_1.SurfaceOptions.ContextualBar === type && ((0, jsx_runtime_1.jsx)(ContextualBarSurface_1.default, { children: children }))] }));
exports.default = SurfaceRender;
