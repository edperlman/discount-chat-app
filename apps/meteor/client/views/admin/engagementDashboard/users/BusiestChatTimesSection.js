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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const ContentForDays_1 = __importDefault(require("./ContentForDays"));
const ContentForHours_1 = __importDefault(require("./ContentForHours"));
const BusiestChatTimesSection = ({ timezone }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [timeUnit, setTimeUnit] = (0, react_1.useState)('hours');
    const timeUnitOptions = (0, react_1.useMemo)(() => [
        ['hours', t('Hours')],
        ['days', t('Days')],
    ], [t]);
    const [displacement, setDisplacement] = (0, react_1.useState)(0);
    const handleTimeUnitChange = (timeUnit) => {
        setTimeUnit(timeUnit);
        setDisplacement(0);
    };
    const handlePreviousDateClick = () => setDisplacement((displacement) => displacement + 1);
    const handleNextDateClick = () => setDisplacement((displacement) => displacement - 1);
    const Content = {
        hours: ContentForHours_1.default,
        days: ContentForDays_1.default,
    }[timeUnit];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(EngagementDashboardCardFilter_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: timeUnitOptions, value: timeUnit, onChange: (value) => handleTimeUnitChange(String(value)), "aria-label": t('Select_period') }) }), (0, jsx_runtime_1.jsx)(Content, { displacement: displacement, onPreviousDateClick: handlePreviousDateClick, onNextDateClick: handleNextDateClick, timezone: timezone })] }));
};
exports.default = BusiestChatTimesSection;
