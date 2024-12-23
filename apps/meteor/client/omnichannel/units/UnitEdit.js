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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useRemoveUnit_1 = require("./useRemoveUnit");
const Contextualbar_1 = require("../../components/Contextualbar");
const useRecordList_1 = require("../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../hooks/useAsyncState");
const useDepartmentsByUnitsList_1 = require("../../views/hooks/useDepartmentsByUnitsList");
const useMonitorsList_1 = require("../../views/hooks/useMonitorsList");
const UnitEdit = ({ unitData, unitMonitors, unitDepartments }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const saveUnit = (0, ui_contexts_1.useMethod)('livechat:saveUnit');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleDeleteUnit = (0, useRemoveUnit_1.useRemoveUnit)();
    const [monitorsFilter, setMonitorsFilter] = (0, react_1.useState)('');
    const debouncedMonitorsFilter = (0, fuselage_hooks_1.useDebouncedValue)(monitorsFilter, 500);
    const [departmentsFilter, setDepartmentsFilter] = (0, react_1.useState)('');
    const debouncedDepartmentsFilter = (0, fuselage_hooks_1.useDebouncedValue)(departmentsFilter, 500);
    const { itemsList: monitorsList, loadMoreItems: loadMoreMonitors } = (0, useMonitorsList_1.useMonitorsList)((0, react_1.useMemo)(() => ({ filter: debouncedMonitorsFilter }), [debouncedMonitorsFilter]));
    const { phase: monitorsPhase, items: monitorsItems, itemCount: monitorsTotal } = (0, useRecordList_1.useRecordList)(monitorsList);
    const { itemsList: departmentsList, loadMoreItems: loadMoreDepartments } = (0, useDepartmentsByUnitsList_1.useDepartmentsByUnitsList)((0, react_1.useMemo)(() => ({ filter: debouncedDepartmentsFilter, unitId: unitData === null || unitData === void 0 ? void 0 : unitData._id }), [debouncedDepartmentsFilter, unitData === null || unitData === void 0 ? void 0 : unitData._id]));
    const { phase: departmentsPhase, items: departmentsItems, itemCount: departmentsTotal } = (0, useRecordList_1.useRecordList)(departmentsList);
    const visibilityOpts = [
        ['public', t('Public')],
        ['private', t('Private')],
    ];
    const { _id } = unitData || {};
    const currUnitDepartments = (0, react_1.useMemo)(() => (unitDepartments === null || unitDepartments === void 0 ? void 0 : unitDepartments.map(({ _id, name }) => ({
        value: _id,
        label: name,
    }))) || [], [unitDepartments]);
    const currUnitMonitors = (0, react_1.useMemo)(() => (unitMonitors === null || unitMonitors === void 0 ? void 0 : unitMonitors.map(({ monitorId, username }) => ({
        value: monitorId,
        label: username,
    }))) || [], [unitMonitors]);
    const { control, formState: { errors, isDirty }, handleSubmit, watch, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        values: {
            name: (unitData === null || unitData === void 0 ? void 0 : unitData.name) || '',
            visibility: (unitData === null || unitData === void 0 ? void 0 : unitData.visibility) || '',
            departments: currUnitDepartments,
            monitors: currUnitMonitors,
        },
    });
    const { departments, monitors } = watch();
    const departmentsOptions = (0, react_1.useMemo)(() => {
        const pending = departments.filter(({ value }) => !departmentsItems.find((dep) => dep._id === value));
        const mappedDepartmentsItems = departmentsItems === null || departmentsItems === void 0 ? void 0 : departmentsItems.map(({ _id, name }) => ({
            value: _id,
            label: name,
        }));
        return [...mappedDepartmentsItems, ...pending];
    }, [departments, departmentsItems]);
    const monitorsOptions = (0, react_1.useMemo)(() => {
        const pending = monitors.filter(({ value }) => !monitorsItems.find((mon) => mon._id === value));
        const mappedMonitorsItems = monitorsItems === null || monitorsItems === void 0 ? void 0 : monitorsItems.map(({ _id, name }) => ({
            value: _id,
            label: name,
        }));
        return [...mappedMonitorsItems, ...pending];
    }, [monitors, monitorsItems]);
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ name, visibility }) {
        const departmentsData = departments.map((department) => ({ departmentId: department.value }));
        const monitorsData = monitors.map((monitor) => ({
            monitorId: monitor.value,
            username: monitor.label,
        }));
        try {
            yield saveUnit(_id, { name, visibility }, monitorsData, departmentsData);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            queryClient.invalidateQueries(['livechat-units']);
            router.navigate('/omnichannel/units');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const visibilityField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentsField = (0, fuselage_hooks_1.useUniqueId)();
    const monitorsField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { "data-qa-id": 'units-contextual-bar', children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: _id ? t('Edit_Unit') : t('New_Unit') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/units') })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { id: formId, is: 'form', autoComplete: 'off', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { error: (_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${nameField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.name) })));
                                            } }) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: visibilityField, required: true, children: t('Visibility') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'visibility', control: control, rules: { required: t('Required_field', { field: t('Visibility') }) }, render: ({ field }) => {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: visibilityField }, field, { options: visibilityOpts, error: (_a = errors === null || errors === void 0 ? void 0 : errors.visibility) === null || _a === void 0 ? void 0 : _a.message, placeholder: t('Select_an_option'), "aria-describedby": `${visibilityField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.visibility) })));
                                            } }) }), (errors === null || errors === void 0 ? void 0 : errors.visibility) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${visibilityField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.visibility.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentsField, required: true, children: t('Departments') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'departments', control: control, rules: { required: t('Required_field', { field: t('Departments') }) }, render: ({ field: { name, value, onChange, onBlur } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedMultiSelectFiltered, { id: departmentsField, name: name, value: value, onChange: onChange, onBlur: onBlur, withTitle: true, filter: departmentsFilter, setFilter: setDepartmentsFilter, options: departmentsOptions, error: Boolean(errors === null || errors === void 0 ? void 0 : errors.departments), placeholder: t('Select_an_option'), endReached: departmentsPhase === useAsyncState_1.AsyncStatePhase.LOADING
                                                    ? undefined
                                                    : (start) => start && loadMoreDepartments(start, Math.min(50, departmentsTotal)), "aria-describedby": `${departmentsField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.departments), renderItem: (_a) => {
                                                    var { label } = _a, props = __rest(_a, ["label"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.CheckOption, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }), selected: value.some((item) => item.value === props.value) })));
                                                } })) }) }), (errors === null || errors === void 0 ? void 0 : errors.departments) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${departmentsField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.departments.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: monitorsField, required: true, children: t('Monitors') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'monitors', control: control, rules: { required: t('Required_field', { field: t('Monitors') }) }, render: ({ field: { name, value, onChange, onBlur } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedMultiSelectFiltered, { id: monitorsField, name: name, value: value, onChange: onChange, onBlur: onBlur, withTitle: true, filter: monitorsFilter, setFilter: setMonitorsFilter, options: monitorsOptions, error: Boolean(errors === null || errors === void 0 ? void 0 : errors.monitors), placeholder: t('Select_an_option'), endReached: monitorsPhase === useAsyncState_1.AsyncStatePhase.LOADING
                                                    ? undefined
                                                    : (start) => start && loadMoreMonitors(start, Math.min(50, monitorsTotal)), "aria-describedby": `${monitorsField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.monitors), renderItem: (_a) => {
                                                    var { label } = _a, props = __rest(_a, ["label"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.CheckOption, Object.assign({}, props, { label: label, selected: value.some((item) => item.value === props.value) })));
                                                } })) }) }), (errors === null || errors === void 0 ? void 0 : errors.monitors) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${monitorsField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.monitors.message }))] })] }) }) }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/units'), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, disabled: !isDirty, type: 'submit', primary: true, children: t('Save') })] }), _id && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: () => handleDeleteUnit(_id), children: t('Delete') }) }) }))] })] }));
};
exports.default = UnitEdit;
