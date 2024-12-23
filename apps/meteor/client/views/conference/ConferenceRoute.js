"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ConferencePage_1 = __importDefault(require("./ConferencePage"));
const AuthenticationCheck_1 = __importDefault(require("../root/MainLayout/AuthenticationCheck"));
const ConferenceRoute = () => {
    return ((0, jsx_runtime_1.jsx)(AuthenticationCheck_1.default, { guest: true, children: (0, jsx_runtime_1.jsx)(ConferencePage_1.default, {}) }));
};
exports.default = ConferenceRoute;
