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
exports.OmnichannelCallToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const OmnichannelCallToggleError_1 = require("./OmnichannelCallToggleError");
const OmnichannelCallToggleLoading_1 = require("./OmnichannelCallToggleLoading");
const OmnichannelCallToggleReady_1 = require("./OmnichannelCallToggleReady");
const CallContext_1 = require("../../../contexts/CallContext");
const OmnichannelCallToggle = (_a) => {
    var props = __rest(_a, []);
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const isCallError = (0, CallContext_1.useIsCallError)();
    if (isCallError) {
        return (0, jsx_runtime_1.jsx)(OmnichannelCallToggleError_1.OmnichannelCallToggleError, Object.assign({}, props));
    }
    if (!isCallReady) {
        return (0, jsx_runtime_1.jsx)(OmnichannelCallToggleLoading_1.OmnichannelCallToggleLoading, Object.assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(OmnichannelCallToggleReady_1.OmnichannelCallToggleReady, Object.assign({}, props));
};
exports.OmnichannelCallToggle = OmnichannelCallToggle;
