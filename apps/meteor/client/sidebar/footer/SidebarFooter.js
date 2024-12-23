"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const SidebarFooterDefault_1 = __importDefault(require("./SidebarFooterDefault"));
const voip_1 = require("./voip");
const CallContext_1 = require("../../contexts/CallContext");
const SidebarFooter = () => {
    const isCallEnabled = (0, CallContext_1.useIsCallEnabled)();
    const ready = (0, CallContext_1.useIsCallReady)();
    if (isCallEnabled && ready) {
        return (0, jsx_runtime_1.jsx)(voip_1.VoipFooter, {});
    }
    return (0, jsx_runtime_1.jsx)(SidebarFooterDefault_1.default, {});
};
exports.default = SidebarFooter;
