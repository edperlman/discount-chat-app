"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedDeviceContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const mockDeviceContextValue = {
    enabled: true,
    selectedAudioOutputDevice: undefined,
    selectedAudioInputDevice: undefined,
    availableAudioOutputDevices: [],
    availableAudioInputDevices: [],
    setAudioOutputDevice: () => undefined,
    setAudioInputDevice: () => undefined,
};
const MockedDeviceContext = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.DeviceContext.Provider, { value: Object.assign(Object.assign({}, mockDeviceContextValue), props), children: children });
};
exports.MockedDeviceContext = MockedDeviceContext;
