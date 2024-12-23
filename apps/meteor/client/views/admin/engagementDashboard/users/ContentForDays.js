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
const colors_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const useWeeklyChatActivity_1 = require("./useWeeklyChatActivity");
const ContentForDays = ({ displacement, onPreviousDateClick, onNextDateClick, timezone }) => {
    const utc = timezone === 'utc';
    const { data } = (0, useWeeklyChatActivity_1.useWeeklyChatActivity)({ displacement, utc });
    const formattedCurrentDate = (0, react_1.useMemo)(() => {
        if (!data) {
            return null;
        }
        const endOfWeek = (0, moment_1.default)(data.day);
        const startOfWeek = (0, moment_1.default)(data.day).subtract(6, 'days');
        return `${startOfWeek.format('L')} - ${endOfWeek.format('L')}`;
    }, [data]);
    const values = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.month) === null || _a === void 0 ? void 0 : _a.map(({ users, day, month, year }) => ({
            users,
            day: (0, moment_1.default)({ year, month: month - 1, day }),
        }))) === null || _b === void 0 ? void 0 : _b.sort(({ day: a }, { day: b }) => a.diff(b))) === null || _c === void 0 ? void 0 : _c.map(({ users, day }) => ({ users, day: String(day.valueOf()) }))) !== null && _d !== void 0 ? _d : [];
    }, [data]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { alignItems: 'center', justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'chevron-down', verticalAlign: 'middle', small: true, onClick: onPreviousDateClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { basis: '50%', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', textAlign: 'center', children: formattedCurrentDate }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'chevron-down', small: true, disabled: displacement === 0, onClick: onNextDateClick })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { children: data ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { height: 196, children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { align: 'stretch', grow: 1, shrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'relative', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', width: 'full', height: 'full', children: (0, jsx_runtime_1.jsx)(bar_1.ResponsiveBar, { data: values, indexBy: 'day', keys: ['users'], groupMode: 'grouped', padding: 0.25, margin: {
                                        // TODO: Get it from theme
                                        bottom: 20,
                                    }, colors: [
                                        // TODO: Get it from theme
                                        colors_1.default.p500,
                                    ], enableLabel: false, enableGridY: false, axisTop: null, axisRight: null, axisBottom: {
                                        tickSize: 0,
                                        // TODO: Get it from theme
                                        tickPadding: 4,
                                        tickRotation: 0,
                                        tickValues: 'every 3 days',
                                        format: (timestamp) => (0, moment_1.default)(parseInt(timestamp, 10)).format('L'),
                                    }, axisLeft: null, animate: true, motionConfig: 'stiff', theme: {
                                        // TODO: Get it from theme
                                        axis: {
                                            ticks: {
                                                text: {
                                                    fill: colors_1.default.n600,
                                                    fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                                    fontSize: '10px',
                                                    fontStyle: 'normal',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.2px',
                                                    lineHeight: '12px',
                                                },
                                            },
                                        },
                                    } }) }) }) }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 196 })) })] }));
};
exports.default = ContentForDays;
