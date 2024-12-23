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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
moment_1.default.locale('en');
const formatToDateInput = (date) => date.format('YYYY-MM-DD');
const todayDate = formatToDateInput((0, moment_1.default)());
const getMonthRange = (monthsToSubtractFromToday) => ({
    start: formatToDateInput((0, moment_1.default)().subtract(monthsToSubtractFromToday, 'month').date(1)),
    end: formatToDateInput(monthsToSubtractFromToday === 0 ? (0, moment_1.default)() : (0, moment_1.default)().subtract(monthsToSubtractFromToday).date(0)),
});
const getWeekRange = (daysToSubtractFromStart, daysToSubtractFromEnd) => ({
    start: formatToDateInput((0, moment_1.default)().subtract(daysToSubtractFromStart, 'day')),
    end: formatToDateInput((0, moment_1.default)().subtract(daysToSubtractFromEnd, 'day')),
});
const DateRangePicker = (_a) => {
    var { onChange = () => undefined } = _a, props = __rest(_a, ["onChange"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [range, setRange] = (0, react_1.useState)({ start: '', end: '' });
    const { start, end } = range;
    const handleStart = (0, fuselage_hooks_1.useMutableCallback)(({ currentTarget }) => {
        const rangeObj = {
            start: currentTarget.value,
            end: range.end,
        };
        setRange(rangeObj);
        onChange(rangeObj);
    });
    const handleEnd = (0, fuselage_hooks_1.useMutableCallback)(({ currentTarget }) => {
        const rangeObj = {
            end: currentTarget.value,
            start: range.start,
        };
        setRange(rangeObj);
        onChange(rangeObj);
    });
    const handleRange = (0, fuselage_hooks_1.useMutableCallback)((range) => {
        setRange(range);
        onChange(range);
    });
    (0, react_1.useEffect)(() => {
        handleRange({
            start: todayDate,
            end: todayDate,
        });
    }, [handleRange]);
    const options = (0, react_1.useMemo)(() => ({
        today: {
            icon: 'history',
            label: t('Today'),
            action: () => {
                handleRange(getWeekRange(0, 0));
            },
        },
        yesterday: {
            icon: 'history',
            label: t('Yesterday'),
            action: () => {
                handleRange(getWeekRange(1, 1));
            },
        },
        thisWeek: {
            icon: 'history',
            label: t('This_week'),
            action: () => {
                handleRange(getWeekRange(7, 0));
            },
        },
        previousWeek: {
            icon: 'history',
            label: t('Previous_week'),
            action: () => {
                handleRange(getWeekRange(14, 7));
            },
        },
        thisMonth: {
            icon: 'history',
            label: t('This_month'),
            action: () => {
                handleRange(getMonthRange(0));
            },
        },
        lastMonth: {
            icon: 'history',
            label: t('Previous_month'),
            action: () => {
                handleRange(getMonthRange(1));
            },
        },
    }), [handleRange, t]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({}, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mi: 'neg-x4', height: 'full', display: 'flex', flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mi: 4, flexShrink: 1, flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Start') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { height: 'x40', display: 'flex', width: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', onChange: handleStart, max: todayDate, value: start }) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mi: 4, flexShrink: 1, flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('End') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { height: 'x40', display: 'flex', width: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', onChange: handleEnd, min: start, max: todayDate, value: end }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { mis: 8, options: options })] })] })] }) })));
};
exports.default = DateRangePicker;
