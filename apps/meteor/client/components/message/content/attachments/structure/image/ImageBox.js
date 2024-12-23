"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ImageBox = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ display: 'flex', maxWidth: 'full', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', borderRadius: 2, borderWidth: 'default', borderStyle: 'solid', borderColor: 'extra-light', position: 'relative' }, props)));
exports.default = ImageBox;
