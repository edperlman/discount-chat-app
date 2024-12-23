"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DeviceManagementInfo_1 = __importDefault(require("./DeviceManagementInfo"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const asyncState_1 = require("../../../../lib/asyncState");
const convertSessionFromAPI = (_a) => {
    var { loginAt, logoutAt } = _a, rest = __rest(_a, ["loginAt", "logoutAt"]);
    return (Object.assign(Object.assign({ loginAt: new Date(loginAt) }, (logoutAt && { logoutAt: new Date(logoutAt) })), rest));
};
const DeviceInfoWithData = ({ deviceId, onReload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { value: data, phase, error, } = (0, useEndpointData_1.useEndpointData)('/v1/sessions/info.admin', { params: (0, react_1.useMemo)(() => ({ sessionId: deviceId }), [deviceId]) });
    if (phase === asyncState_1.AsyncStatePhase.LOADING) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    if (error || !data) {
        return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Device_Info') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, {})] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('We_Could_not_retrive_any_data') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: error === null || error === void 0 ? void 0 : error.message })] }) }) })] }));
    }
    return (0, jsx_runtime_1.jsx)(DeviceManagementInfo_1.default, Object.assign({}, convertSessionFromAPI(data), { onReload: onReload }));
};
exports.default = DeviceInfoWithData;
