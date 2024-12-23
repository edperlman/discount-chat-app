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
exports.getHighestTimeUnit = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const convertTimeUnit_1 = require("../../../../../lib/convertTimeUnit");
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
const getHighestTimeUnit = (value) => {
    const minutes = (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.minutes, value);
    if (minutes % 60 !== 0) {
        return convertTimeUnit_1.TIMEUNIT.minutes;
    }
    const hours = (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.hours, value);
    if (hours % 24 !== 0) {
        return convertTimeUnit_1.TIMEUNIT.hours;
    }
    return convertTimeUnit_1.TIMEUNIT.days;
};
exports.getHighestTimeUnit = getHighestTimeUnit;
const sanitizeInputValue = (value) => {
    if (!value) {
        return 0;
    }
    const sanitizedValue = Math.max(0, value).toFixed(0);
    return Number(sanitizedValue);
};
function TimespanSettingInput({ _id, label, value, placeholder, readonly, autocomplete, disabled, required, onChangeValue, hasResetButton, onResetButtonClick, packageValue, }) {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [timeUnit, setTimeUnit] = (0, react_1.useState)((0, exports.getHighestTimeUnit)(Number(value)));
    const [internalValue, setInternalValue] = (0, react_1.useState)((0, convertTimeUnit_1.msToTimeUnit)(timeUnit, Number(value)));
    const handleChange = (event) => {
        const newValue = sanitizeInputValue(Number(event.currentTarget.value));
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue((0, convertTimeUnit_1.timeUnitToMs)(timeUnit, newValue));
        setInternalValue(newValue);
    };
    const handleChangeTimeUnit = (nextTimeUnit) => {
        if (typeof nextTimeUnit !== 'string') {
            return;
        }
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue((0, convertTimeUnit_1.timeUnitToMs)(nextTimeUnit, internalValue));
        setTimeUnit(nextTimeUnit);
    };
    const timeUnitOptions = (0, react_1.useMemo)(() => {
        return Object.entries(convertTimeUnit_1.TIMEUNIT).map(([label, value]) => [value, i18n.exists(label) ? t(label) : label]); // todo translate
    }, [t]);
    const handleResetButtonClick = () => {
        onResetButtonClick === null || onResetButtonClick === void 0 ? void 0 : onResetButtonClick();
        const newTimeUnit = (0, exports.getHighestTimeUnit)(Number(packageValue));
        setTimeUnit(newTimeUnit);
        setInternalValue((0, convertTimeUnit_1.msToTimeUnit)(newTimeUnit, Number(packageValue)));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: handleResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { "data-qa-setting-id": _id, id: _id, type: 'number', value: internalValue, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { value: timeUnit, disabled: disabled, options: timeUnitOptions, onChange: handleChangeTimeUnit }) })] }));
}
exports.default = TimespanSettingInput;
