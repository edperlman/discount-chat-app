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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useTimezoneNameList_1 = require("../../../hooks/useTimezoneNameList");
const additionalForms_1 = require("../additionalForms");
const mapBusinessHoursForm_1 = require("./mapBusinessHoursForm");
// TODO: replace `Select` in favor `SelectFiltered`
// TODO: add time validation for start and finish not be equal on UI
// TODO: add time validation for start not be higher than finish on UI
const BusinessHoursForm = ({ type }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const timeZones = (0, useTimezoneNameList_1.useTimezoneNameList)();
    const timeZonesOptions = (0, react_1.useMemo)(() => timeZones.map((name) => [name, t(name)]), [t, timeZones]);
    const daysOptions = (0, react_1.useMemo)(() => mapBusinessHoursForm_1.DAYS_OF_WEEK.map((day) => [day, t(day)]), [t]);
    const { watch, control } = (0, react_hook_form_1.useFormContext)();
    const { daysTime } = watch();
    const { fields: daysTimeFields, replace } = (0, react_hook_form_1.useFieldArray)({ control, name: 'daysTime' });
    const timezoneField = (0, fuselage_hooks_1.useUniqueId)();
    const daysOpenField = (0, fuselage_hooks_1.useUniqueId)();
    const daysTimeField = (0, fuselage_hooks_1.useUniqueId)();
    const handleChangeDaysTime = (values) => {
        const newValues = values
            .map((item) => daysTime.find(({ day }) => day === item) || (0, mapBusinessHoursForm_1.defaultWorkHours)(true).find(({ day }) => day === item))
            .filter((item) => Boolean(item));
        replace(newValues);
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [type === 'custom' && (0, jsx_runtime_1.jsx)(additionalForms_1.BusinessHoursMultiple, {}), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: timezoneField, children: t('Timezone') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'timezoneName', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: timezoneField }, field, { options: timeZonesOptions })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { title: t('Daylight_savings_time'), type: 'info', mbs: 'x8', children: t('Business_hours_will_update_automatically') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: daysOpenField, children: t('Open_days_of_the_week') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'daysOpen', control: control, render: ({ field: { onChange, value, name, onBlur } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelect, { id: daysOpenField, onBlur: onBlur, name: name, onChange: (values) => {
                                    handleChangeDaysTime(values);
                                    onChange(values);
                                }, options: daysOptions, value: value, placeholder: t('Select_an_option'), w: 'full' })) }) })] }), daysTimeFields.map((dayTime, index) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t(dayTime.day) }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, mie: 2, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: `${daysTimeField + index}-start`, children: t('Open') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `daysTime.${index}.start.time`, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ id: `${daysTimeField + index}-start`, type: 'time' }, field)) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, mis: 2, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: `${daysTimeField + index}-finish`, children: t('Close') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `daysTime.${index}.finish.time`, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ id: `${daysTimeField + index}-finish`, type: 'time' }, field)) })] })] })] }, dayTime.id)))] }));
};
exports.default = BusinessHoursForm;
