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
exports.BarChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const bar_1 = require("@nivo/bar");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const constants_1 = require("./constants");
const sideLabelStyle = {
    fill: fuselage_1.Palette.text['font-annotation'].toString(),
    fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
    fontSize: 12,
};
const horizontalSideLabel = ({ bars, labelSkipWidth }) => ((0, jsx_runtime_1.jsx)("g", { children: bars === null || bars === void 0 ? void 0 : bars.map(({ width, height, y, data }) => {
        if (width >= labelSkipWidth) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)("text", { transform: `translate(${width + 8}, ${y + height / 2})`, textAnchor: 'left', dominantBaseline: 'central', style: sideLabelStyle, children: data.formattedValue }, data.indexValue));
    }) }));
const verticalSideLabel = ({ bars, labelSkipHeight, innerHeight }) => ((0, jsx_runtime_1.jsx)("g", { children: bars === null || bars === void 0 ? void 0 : bars.map(({ width, height, x, data }) => {
        if (height >= labelSkipHeight) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)("text", { transform: `translate(${x + width / 2}, ${innerHeight - height - 8})`, textAnchor: 'middle', dominantBaseline: 'central', style: sideLabelStyle, children: data.formattedValue }, data.indexValue));
    }) }));
const BarChart = ({ data, maxWidth, height, direction = 'vertical', indexBy = 'label', keys, margins, reverse, enableGridX = false, enableGridY = false, axis: { axisTop, axisLeft, axisRight, axisBottom } = {}, colors, }) => {
    const { minHeight, padding } = (0, react_1.useMemo)(() => {
        const minHeight = data.length * 22;
        const padding = data.length <= 4 ? 0.5 : 0.05;
        return { minHeight, padding };
    }, [data.length]);
    const sideLabel = direction === 'vertical' ? verticalSideLabel : horizontalSideLabel;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: maxWidth, height: height, overflowY: 'auto', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'relative', height: Math.max(minHeight, height), padding: 8, overflow: 'hidden', children: (0, jsx_runtime_1.jsx)(bar_1.ResponsiveBar, { animate: true, data: data, indexBy: indexBy, layout: direction, layers: ['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', sideLabel], indexScale: { type: 'band', round: false }, keys: keys, groupMode: 'grouped', padding: padding, colors: colors !== null && colors !== void 0 ? colors : { datum: 'data.color' }, enableGridY: enableGridY, enableGridX: enableGridX, axisTop: axisTop || null, axisRight: axisRight || null, axisBottom: axisBottom || null, axisLeft: axisLeft || null, reverse: reverse, borderRadius: 4, labelTextColor: 'white', margin: margins, motionConfig: 'stiff', theme: constants_1.REPORTS_CHARTS_THEME, labelSkipWidth: direction === 'horizontal' ? 24 : undefined, labelSkipHeight: direction === 'vertical' ? 16 : undefined, valueScale: { type: 'linear' }, tooltip: ({ data }) => (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { children: `${data.label}: ${data.value}` }), barAriaLabel: ({ data }) => data.label }) }) }));
};
exports.BarChart = BarChart;
