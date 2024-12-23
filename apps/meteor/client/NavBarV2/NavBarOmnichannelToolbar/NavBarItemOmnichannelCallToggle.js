"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const NavBarItemOmnichannelCallToggleError_1 = __importDefault(require("./NavBarItemOmnichannelCallToggleError"));
const NavBarItemOmnichannelCallToggleLoading_1 = __importDefault(require("./NavBarItemOmnichannelCallToggleLoading"));
const NavBarItemOmnichannelCallToggleReady_1 = __importDefault(require("./NavBarItemOmnichannelCallToggleReady"));
const CallContext_1 = require("../../contexts/CallContext");
const NavBarItemOmnichannelCallToggle = (props) => {
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const isCallError = (0, CallContext_1.useIsCallError)();
    if (isCallError) {
        return (0, jsx_runtime_1.jsx)(NavBarItemOmnichannelCallToggleError_1.default, Object.assign({}, props));
    }
    if (!isCallReady) {
        return (0, jsx_runtime_1.jsx)(NavBarItemOmnichannelCallToggleLoading_1.default, Object.assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(NavBarItemOmnichannelCallToggleReady_1.default, Object.assign({}, props));
};
exports.default = NavBarItemOmnichannelCallToggle;
