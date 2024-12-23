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
const bar_1 = require("@nivo/bar");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useHourlyChatActivity_1 = require("./useHourlyChatActivity");
const ContentForHours = ({ displacement, onPreviousDateClick, onNextDateClick, timezone }) => {
    const utc = timezone === 'utc';
    const { data } = (0, useHourlyChatActivity_1.useHourlyChatActivity)({ displacement, utc });
    const { t } = (0, react_i18next_1.useTranslation)();
    const isLgScreen = (0, fuselage_hooks_1.useBreakpoints)().includes('lg');
    const values = (0, react_1.useMemo)(() => {
        var _a;
        if (!data) {
            return [];
        }
        const divider = 2;
        const values = Array.from({ length: 24 / divider }, (_, i) => ({
            hour: String(divider * i),
            users: 0,
        }));
        for (const { hour, users } of (_a = data === null || data === void 0 ? void 0 : data.hours) !== null && _a !== void 0 ? _a : []) {
            const i = Math.floor(hour / divider);
            values[i] = values[i] || { hour: String(divider * i), users: 0 };
            values[i].users += users;
        }
        return values;
    }, [data]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, small: true, onClick: onPreviousDateClick, children: (0, jsx_runtime_1.jsx)(fuselage_1.Chevron, { left: true, size: 'x20', style: { verticalAlign: 'middle' } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 8, flexBasis: '25%', is: 'span', style: { textAlign: 'center' }, children: data ? (0, moment_1.default)(data.day).format(displacement < 7 ? 'dddd' : 'L') : null }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, small: true, disabled: displacement === 0, onClick: onNextDateClick, children: (0, jsx_runtime_1.jsx)(fuselage_1.Chevron, { right: true, size: 'x20', style: { verticalAlign: 'middle' } }) })] }), data ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', height: '196px', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { alignSelf: 'stretch', flexGrow: 1, flexShrink: 0, position: 'relative', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', width: '100%', height: '100%', children: (0, jsx_runtime_1.jsx)(bar_1.ResponsiveBar, { data: values, indexBy: 'hour', keys: ['users'], groupMode: 'grouped', padding: 0.25, margin: {
                                // TODO: Get it from theme
                                bottom: 30,
                                right: 5,
                            }, colors: [
                                // TODO: Get it from theme
                                colors_json_1.default.p500,
                            ], enableLabel: false, enableGridY: false, axisTop: null, axisRight: null, axisBottom: {
                                tickSize: 0,
                                // TODO: Get it from theme
                                tickPadding: 4,
                                tickRotation: isLgScreen ? 0 : 25,
                                tickValues: 'every 2 hours',
                                format: (hour) => (0, moment_1.default)().set({ hour, minute: 0, second: 0 }).format('LT'),
                            }, axisLeft: null, animate: true, motionConfig: 'stiff', theme: {
                                // TODO: Get it from theme
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: colors_json_1.default.n600,
                                            fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                            fontSize: '10px',
                                            fontStyle: 'normal',
                                            fontWeight: 600,
                                            letterSpacing: '0.2px',
                                            lineHeight: '12px',
                                        },
                                    },
                                },
                            }, tooltip: ({ value }) => (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { children: t('Value_users', { value }) }) }) }) }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 196 }))] }));
};
exports.default = ContentForHours;
