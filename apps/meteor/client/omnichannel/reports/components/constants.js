"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERIOD_OPTIONS = exports.COLORS = exports.REPORTS_CHARTS_THEME = void 0;
const fuselage_1 = require("@rocket.chat/fuselage");
exports.REPORTS_CHARTS_THEME = {
    labels: {
        text: { fontSize: 12 },
    },
    legends: {
        text: {
            fill: fuselage_1.Palette.text['font-annotation'].toString(),
        },
    },
    axis: {
        domain: {
            line: {
                stroke: fuselage_1.Palette.text['font-annotation'].toString(),
                strokeWidth: 1,
            },
        },
        ticks: {
            text: {
                fill: fuselage_1.Palette.text['font-annotation'].toString(),
                fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                fontSize: 12,
                fontStyle: 'normal',
                letterSpacing: '0.2px',
                lineHeight: '16px',
            },
        },
    },
};
exports.COLORS = {
    service2: fuselage_1.Palette.statusColor['status-font-on-service-2'].toString(),
    danger: fuselage_1.Palette.statusColor['status-font-on-danger'].toString(),
    success: fuselage_1.Palette.statusColor['status-font-on-success'].toString(),
    info: fuselage_1.Palette.statusColor['status-font-on-info'].toString(),
    warning: fuselage_1.Palette.statusColor['status-font-on-warning'].toString(),
    warning2: fuselage_1.Palette.statusColor['status-font-on-warning-2'].toString(),
};
exports.PERIOD_OPTIONS = ['today', 'this week', 'last 15 days', 'this month', 'last 6 months', 'last year'];
