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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const useEndpointData_1 = require("../../../../../hooks/useEndpointData");
const asyncState_1 = require("../../../../../lib/asyncState");
const Field_1 = __importDefault(require("../../../components/Field"));
const Info_1 = __importDefault(require("../../../components/Info"));
const Label_1 = __importDefault(require("../../../components/Label"));
const FormSkeleton_1 = require("../../components/FormSkeleton");
const VisitorClientInfo = ({ uid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { value: userData, phase: state, error, } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/visitors.info', { params: (0, react_1.useMemo)(() => ({ visitorId: uid }), [uid]) });
    if (state === asyncState_1.AsyncStatePhase.LOADING) {
        return (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {});
    }
    if (error || !userData || !userData.visitor.userAgent) {
        return null;
    }
    const ua = new ua_parser_js_1.default();
    ua.setUA(userData.visitor.userAgent);
    const clientData = {
        os: `${ua.getOS().name} ${ua.getOS().version}`,
        browser: `${ua.getBrowser().name} ${ua.getBrowser().version}`,
        host: userData.visitor.host,
        ip: userData.visitor.ip,
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [clientData.os && ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('OS') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: clientData.os })] })), clientData.browser && ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Browser') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: clientData.browser })] })), clientData.host && ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Host') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: clientData.host })] })), clientData.ip && ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('IP') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: clientData.ip })] }))] }));
};
exports.default = VisitorClientInfo;
