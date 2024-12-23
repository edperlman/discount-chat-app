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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const formatToDateInput = (date) => date.locale('en').format('YYYY-MM-DD');
const todayDate = formatToDateInput((0, moment_1.default)());
const getMonthRange = (monthsToSubtractFromToday) => ({
    start: formatToDateInput((0, moment_1.default)().subtract(monthsToSubtractFromToday, 'month').date(1)),
    end: formatToDateInput(monthsToSubtractFromToday === 0 ? (0, moment_1.default)() : (0, moment_1.default)().subtract(monthsToSubtractFromToday).date(0)),
});
const getWeekRange = (daysToSubtractFromStart, daysToSubtractFromEnd) => ({
    start: formatToDateInput((0, moment_1.default)().subtract(daysToSubtractFromStart, 'day')),
    end: formatToDateInput((0, moment_1.default)().subtract(daysToSubtractFromEnd, 'day')),
});
const DateRangePicker = ({ onChange }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleRange = (0, fuselage_hooks_1.useMutableCallback)((range) => {
        onChange(range);
    });
    const timeOptions = (0, react_1.useMemo)(() => {
        return [
            ['today', t('Today')],
            ['yesterday', t('Yesterday')],
            ['thisWeek', t('This_week')],
            ['previousWeek', t('Previous_week')],
            ['thisMonth', t('This_month')],
            ['alldates', t('All')],
        ].map(([value, label]) => [value, label]);
    }, [t]);
    (0, react_1.useEffect)(() => {
        handleRange({
            start: formatToDateInput((0, moment_1.default)(0)),
            end: todayDate,
        });
    }, [handleRange]);
    const handleOptionClick = (0, fuselage_hooks_1.useMutableCallback)((action) => {
        switch (action) {
            case 'today':
                handleRange(getWeekRange(0, 0));
                break;
            case 'yesterday':
                handleRange(getWeekRange(1, 1));
                break;
            case 'thisWeek':
                handleRange(getWeekRange(7, 0));
                break;
            case 'previousWeek':
                handleRange(getWeekRange(14, 7));
                break;
            case 'thisMonth':
                handleRange(getMonthRange(0));
                break;
            case 'alldates':
                handleRange({
                    start: formatToDateInput((0, moment_1.default)(0)),
                    end: todayDate,
                });
                break;
            default:
                break;
        }
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { defaultSelectedKey: 'alldates', width: '100%', options: timeOptions, onChange: handleOptionClick }) }));
};
exports.default = DateRangePicker;
