"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Contextualbar_1 = require("../../components/Contextualbar");
function SlaEdit(_a) {
    var _b, _c, _d, _e;
    var { data, isNew, slaId, reload } = _a, props = __rest(_a, ["data", "isNew", "slaId", "reload"]);
    const slasRoute = (0, ui_contexts_1.useRoute)('omnichannel-sla-policies');
    const saveSLA = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/sla');
    const updateSLA = (0, ui_contexts_1.useEndpoint)('PUT', `/v1/livechat/sla/:slaId`, { slaId: slaId || '' });
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const t = (0, ui_contexts_1.useTranslation)();
    const { name, description, dueTimeInMinutes } = data || {};
    const { control, getValues, formState: { errors, isValid, isDirty }, reset, } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        defaultValues: { name, description, dueTimeInMinutes },
    });
    const { field: nameField } = (0, react_hook_form_1.useController)({
        control,
        name: 'name',
        rules: { required: t('Required_field', { field: t('Name') }) },
    });
    const { field: dueTimeField } = (0, react_hook_form_1.useController)({
        control,
        name: 'dueTimeInMinutes',
        rules: {
            validate(value) {
                return Number(value || 0) <= 0 ? t('Required_field', { field: t('Estimated_wait_time_in_minutes') }) : true;
            },
        },
    });
    const { field: descField } = (0, react_hook_form_1.useController)({ control, name: 'description' });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(this, void 0, void 0, function* () {
        const { name, description, dueTimeInMinutes } = getValues();
        if (!isValid || !name || dueTimeInMinutes === undefined) {
            return dispatchToastMessage({ type: 'error', message: t('Required_field') });
        }
        try {
            const payload = { name, description, dueTimeInMinutes: Number(dueTimeInMinutes) };
            if (slaId) {
                yield updateSLA(payload);
            }
            else {
                yield saveSLA(payload);
            }
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            reload();
            slasRoute.push({});
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({ is: 'form' }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [t('Name'), "*"] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: t('Name'), flexGrow: 1 }, nameField, { error: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_c = errors.name) === null || _c === void 0 ? void 0 : _c.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: t('Description'), flexGrow: 1 }, descField)) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [t('Estimated_wait_time_in_minutes'), "*"] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ placeholder: t('Estimated_wait_time_in_minutes'), flexGrow: 1 }, dueTimeField, { error: (_d = errors.dueTimeInMinutes) === null || _d === void 0 ? void 0 : _d.message })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_e = errors.dueTimeInMinutes) === null || _e === void 0 ? void 0 : _e.message })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', w: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inlineEnd: 4, children: [!isNew && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { flexGrow: 1, type: 'reset', disabled: !isDirty, onClick: () => reset(), children: t('Reset') })), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, mie: 'none', flexGrow: 1, disabled: !isDirty || !isValid, onClick: handleSave, children: t('Save') })] }) }) }) })] })));
}
exports.default = SlaEdit;
