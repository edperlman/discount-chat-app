"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pie_1 = require("@nivo/pie");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const constants_1 = require("./constants");
const legendItemHeight = 20;
const legendItemWidth = 200;
const legendItemsSpacing = 8;
const legendSpacing = 24;
const legendInlineSize = legendItemWidth + legendSpacing;
const PieChart = ({ data, width, height, colors, }) => {
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    const isSmallScreen = !breakpoints.includes('md');
    const legendBlockSize = data.length * (legendItemHeight + legendItemsSpacing) + legendSpacing;
    return ((0, jsx_runtime_1.jsx)(pie_1.Pie, { data: data, innerRadius: 0.6, colors: colors !== null && colors !== void 0 ? colors : { datum: 'data.color' }, motionConfig: 'stiff', theme: constants_1.REPORTS_CHARTS_THEME, enableArcLinkLabels: false, enableArcLabels: false, tooltip: ({ datum }) => (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { children: datum.label }), width: isSmallScreen ? width : width + legendInlineSize, height: isSmallScreen ? height + legendBlockSize : height, margin: isSmallScreen ? { top: legendBlockSize } : { right: legendInlineSize }, legends: [
            {
                direction: 'column',
                justify: false,
                symbolSize: 12,
                itemDirection: 'left-to-right',
                symbolShape: 'circle',
                anchor: isSmallScreen ? 'top' : 'right',
                translateX: isSmallScreen ? 0 : legendInlineSize,
                translateY: isSmallScreen ? legendBlockSize * -1 : 0,
                itemWidth: legendItemWidth,
                itemHeight: legendItemHeight,
                itemsSpacing: legendItemsSpacing,
            },
        ] }));
};
exports.PieChart = PieChart;
