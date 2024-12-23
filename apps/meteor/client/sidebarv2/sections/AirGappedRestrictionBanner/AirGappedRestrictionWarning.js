"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AirGappedRestrictionWarning = ({ isRestricted, remainingDays }) => {
    if (isRestricted) {
        return ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Airgapped_workspace_restriction', children: ["This air-gapped workspace is in read-only mode.", ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', is: 'span', children: "Connect it to internet or upgraded to a premium plan to restore full functionality." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Airgapped_workspace_warning', values: { remainingDays }, children: ["This air-gapped workspace will enter read-only mode in ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { remainingDays } }), " days.", ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', is: 'span', children: "Connect it to internet or upgrade to a premium plan to prevent this." })] }));
};
exports.default = AirGappedRestrictionWarning;
