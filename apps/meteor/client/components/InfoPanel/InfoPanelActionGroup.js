"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const InfoPanelSection_1 = __importDefault(require("./InfoPanelSection"));
const InfoPanelActionGroup = (props) => ((0, jsx_runtime_1.jsx)(InfoPanelSection_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, Object.assign({ align: 'center', stretch: true }, props)) }));
exports.default = InfoPanelActionGroup;
