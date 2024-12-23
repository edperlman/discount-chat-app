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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const apiCurlGetter_1 = require("../../../helpers/apiCurlGetter");
const AppDetailsAPIs = ({ apis }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const getApiCurl = (0, apiCurlGetter_1.apiCurlGetter)(absoluteUrl);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', mb: 12, children: t('APIs') }), apis.map((api) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 8, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', children: [api.methods.join(' | ').toUpperCase(), " ", api.path] }), api.methods.map((method, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withRichContent: true, children: (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { children: getApiCurl(method, api).map((curlAddress, index) => ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [curlAddress, (0, jsx_runtime_1.jsx)("br", {})] }, index))) }) }) }) }, index)))] }, api.path)))] }) }));
};
exports.default = AppDetailsAPIs;
