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
const pie_1 = require("@nivo/pie");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useLocalePercentage_1 = require("../../../../hooks/useLocalePercentage");
const graphColors = (color) => ({
    used: color || fuselage_1.Palette.statusColor['status-font-on-success'].toString(),
    free: fuselage_1.Palette.stroke['stroke-extra-light'].toString(),
});
const UsagePieGraph = ({ used = 0, total = 0, label, color, size = 140 }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const parsedData = (0, react_1.useMemo)(() => [
        {
            id: 'used',
            label: 'used',
            value: used,
        },
        {
            id: 'free',
            label: 'free',
            value: total - used,
        },
    ], [total, used]);
    const getColor = (0, react_1.useCallback)((datum) => {
        if (!datum || typeof datum.id !== 'string') {
            return '';
        }
        return graphColors(color)[datum.id];
    }, [color]);
    const unlimited = total === 0;
    const localePercentage = (0, useLocalePercentage_1.useLocalePercentage)(total, used, 0);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { size: `x${size}`, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'relative', children: [(0, jsx_runtime_1.jsx)(pie_1.Pie, { data: parsedData, margin: { top: 10, right: 10, bottom: 10, left: 10 }, innerRadius: 0.8, colors: getColor, width: size, height: size, enableArcLabels: false, enableArcLinkLabels: false }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', fontScale: 'p2m', style: { left: 0, right: 0, top: 0, bottom: 0 }, children: unlimited ? '∞' : localePercentage })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontScale: 'p2', color: 'font-secondary-info', children: [unlimited &&
                        t('used_limit_infinite', {
                            used,
                        }), !unlimited &&
                        t('used_limit', {
                            used,
                            limit: total,
                        })] }), label && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', mbs: 4, color: 'font-secondary-info', children: label }))] }));
};
exports.default = (0, react_1.memo)(UsagePieGraph);
