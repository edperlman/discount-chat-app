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
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const ComposerMessage_1 = __importDefault(require("../ComposerMessage"));
const ComposerFederationDisabled_1 = __importDefault(require("./ComposerFederationDisabled"));
const ComposerFederationJoinRoomDisabled_1 = __importDefault(require("./ComposerFederationJoinRoomDisabled"));
const ComposerFederation = (_a) => {
    var { subscription, children } = _a, props = __rest(_a, ["subscription", "children"]);
    const federationEnabled = (0, ui_contexts_1.useSetting)('Federation_Matrix_enabled') === true;
    const federationModuleEnabled = (0, useHasLicenseModule_1.useHasLicenseModule)('federation') === true;
    if (!federationEnabled) {
        return (0, jsx_runtime_1.jsx)(ComposerFederationDisabled_1.default, {});
    }
    if (!subscription && !federationModuleEnabled) {
        return (0, jsx_runtime_1.jsx)(ComposerFederationJoinRoomDisabled_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, (0, jsx_runtime_1.jsx)(ComposerMessage_1.default, Object.assign({}, props))] }));
};
exports.default = ComposerFederation;
