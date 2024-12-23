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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericResourceUsage_1 = require("../../../components/GenericResourceUsage");
const EnabledAppsCount = ({ limit, enabled, context, tooltip, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const variant = (0, react_1.useMemo)(() => {
        if (enabled + 1 === limit) {
            return 'warning';
        }
        if (limit === 0 || enabled >= limit) {
            return 'danger';
        }
        return 'success';
    }, [enabled, limit]);
    const percentage = limit === 0 ? 100 : Math.round((enabled * 100) / limit);
    return ((0, jsx_runtime_1.jsx)(GenericResourceUsage_1.GenericResourceUsage, { title: context === 'private' ? t('Private_Apps_Count_Enabled', { count: enabled }) : t('Apps_Count_Enabled', { count: enabled }), value: enabled, max: limit, percentage: percentage, threshold: 80, variant: variant, tooltip: tooltip }));
};
exports.default = EnabledAppsCount;
