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
const formatToDateInput = (date) => {
    if (!date) {
        return '';
    }
    const yearPart = date.getFullYear().toString().padStart(4, '0').slice(0, 4);
    const monthPart = (date.getMonth() + 1).toString().padStart(2, '0').slice(0, 2);
    const dayPart = date.getDate().toString().padStart(2, '0').slice(0, 2);
    return `${yearPart}-${monthPart}-${dayPart}`;
};
const parseFromStartDateInput = (date) => {
    if (!date) {
        return undefined;
    }
    return (0, moment_1.default)(date, 'YYYY-MM-DD').startOf('day').toDate();
};
const parseFromEndDateInput = (date) => {
    if (!date) {
        return undefined;
    }
    return (0, moment_1.default)(date, 'YYYY-MM-DD').endOf('day').toDate();
};
const dateRangeReducer = (state, action) => {
    switch (action) {
        case 'today': {
            return {
                start: (0, moment_1.default)().startOf('day').toDate(),
                end: (0, moment_1.default)().endOf('day').toDate(),
            };
        }
        case 'yesterday': {
            return {
                start: (0, moment_1.default)().subtract(1, 'day').startOf('day').toDate(),
                end: (0, moment_1.default)().subtract(1, 'day').endOf('day').toDate(),
            };
        }
        case 'this-week': {
            return {
                start: (0, moment_1.default)().startOf('week').toDate(),
                end: (0, moment_1.default)().endOf('day').toDate(),
            };
        }
        case 'last-week': {
            return {
                start: (0, moment_1.default)().subtract(1, 'week').startOf('week').toDate(),
                end: (0, moment_1.default)().subtract(1, 'week').endOf('week').toDate(),
            };
        }
        case 'this-month': {
            return {
                start: (0, moment_1.default)().startOf('month').toDate(),
                end: (0, moment_1.default)().endOf('day').toDate(),
            };
        }
        case 'last-month': {
            return {
                start: (0, moment_1.default)().subtract(1, 'month').startOf('month').toDate(),
                end: (0, moment_1.default)().subtract(1, 'month').endOf('month').toDate(),
            };
        }
        default:
            if (typeof action === 'object' && 'newStart' in action) {
                if (action.newStart === formatToDateInput(state.start)) {
                    return state;
                }
                return Object.assign(Object.assign({}, state), { start: parseFromStartDateInput(action.newStart) });
            }
            if (typeof action === 'object' && 'newEnd' in action) {
                if (action.newEnd === formatToDateInput(state.end)) {
                    return state;
                }
                return Object.assign(Object.assign({}, state), { end: parseFromEndDateInput(action.newEnd) });
            }
            const newState = typeof action === 'function' ? action(state) : action;
            return newState;
    }
};
const DateRangePicker = (_a) => {
    var { value, onChange } = _a, props = __rest(_a, ["value", "onChange"]);
    const dispatch = (0, fuselage_hooks_1.useMutableCallback)((action) => {
        const newRange = dateRangeReducer(value !== null && value !== void 0 ? value : { start: undefined, end: undefined }, action);
        onChange === null || onChange === void 0 ? void 0 : onChange(newRange);
    });
    const handleChangeStart = (0, fuselage_hooks_1.useMutableCallback)(({ currentTarget }) => {
        dispatch({ newStart: currentTarget.value });
    });
    const handleChangeEnd = (0, fuselage_hooks_1.useMutableCallback)(({ currentTarget }) => {
        dispatch({ newEnd: currentTarget.value });
    });
    const startDate = (0, react_1.useMemo)(() => formatToDateInput(value === null || value === void 0 ? void 0 : value.start), [value === null || value === void 0 ? void 0 : value.start]);
    const endDate = (0, react_1.useMemo)(() => formatToDateInput(value === null || value === void 0 ? void 0 : value.end), [value === null || value === void 0 ? void 0 : value.end]);
    const maxStartDate = (0, react_1.useMemo)(() => {
        return formatToDateInput((value === null || value === void 0 ? void 0 : value.end) ? moment_1.default.min((0, moment_1.default)(value.end), (0, moment_1.default)()).toDate() : new Date());
    }, [value === null || value === void 0 ? void 0 : value.end]);
    const minEndDate = startDate;
    const maxEndDate = (0, react_1.useMemo)(() => formatToDateInput(new Date()), []);
    const { t } = (0, react_i18next_1.useTranslation)();
    const presets = (0, react_1.useMemo)(() => ({
        today: {
            label: t('Today'),
            action: () => dispatch('today'),
        },
        yesterday: {
            label: t('Yesterday'),
            action: () => dispatch('yesterday'),
        },
        thisWeek: {
            label: t('This_week'),
            action: () => dispatch('this-week'),
        },
        previousWeek: {
            label: t('Previous_week'),
            action: () => dispatch('last-week'),
        },
        thisMonth: {
            label: t('This_month'),
            action: () => dispatch('this-month'),
        },
        lastMonth: {
            label: t('Previous_month'),
            action: () => dispatch('last-month'),
        },
    }), [dispatch, t]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ marginInline: -4 }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', value: startDate, max: maxStartDate, flexGrow: 1, height: 20, onChange: handleChangeStart }), (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { type: 'date', min: minEndDate, value: endDate, max: maxEndDate, flexGrow: 1, height: 20, onChange: handleChangeEnd }), (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { options: presets, renderItem: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ icon: 'history' }, props)), alignSelf: 'center' })] }) })));
};
exports.default = DateRangePicker;
