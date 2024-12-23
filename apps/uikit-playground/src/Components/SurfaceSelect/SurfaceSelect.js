"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../Context");
const options_1 = __importDefault(require("./options"));
const SurfaceSelect = () => {
    const { state: { screens, activeScreen }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: options_1.default, value: `${screens[activeScreen].payload.surface}`, placeholder: "Surface", onChange: (e) => {
            dispatch((0, Context_1.surfaceAction)(typeof e === 'string' ? parseInt(e) : Number(e)));
        } }));
};
exports.default = SurfaceSelect;
