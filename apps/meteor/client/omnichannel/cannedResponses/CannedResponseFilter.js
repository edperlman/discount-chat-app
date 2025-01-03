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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoCompleteAgent_1 = __importDefault(require("../../components/AutoCompleteAgent"));
const CannedResponsesFilter = ({ createdBy, setCreatedBy, sharing, setSharing, text, setText }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const sharingList = [
        ['', t('All')],
        ['user', t('Private')],
        ['global', t('Public')],
        ['department', t('Department')],
    ];
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 16, display: 'flex', flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 4, children: t('Search') }), (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: text, onChange: (e) => setText(e.target.value), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 4, children: t('Sharing') }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { value: sharing, onChange: (value) => setSharing(value), options: sharingList })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 4, children: t('Created_by') }), (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { value: createdBy, onChange: setCreatedBy, haveAll: true })] })] }));
};
exports.default = (0, react_1.memo)(CannedResponsesFilter);