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
const BusinessHoursForm_1 = __importDefault(require("./BusinessHoursForm"));
const mapBusinessHoursForm_1 = require("./mapBusinessHoursForm");
const useIsSingleBusinessHours_1 = require("./useIsSingleBusinessHours");
const Page_1 = require("../../../components/Page");
const useRemoveBusinessHour_1 = require("../../../omnichannel/businessHours/useRemoveBusinessHour");
const getInitialData = (businessHourData) => {
    var _a, _b;
    return ({
        name: (businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.name) || '',
        timezoneName: ((_a = businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.timezone) === null || _a === void 0 ? void 0 : _a.name) || 'America/Sao_Paulo',
        daysOpen: ((businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.workHours) || (0, mapBusinessHoursForm_1.defaultWorkHours)()).filter(({ open }) => !!open).map(({ day }) => day),
        daysTime: ((businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.workHours) || (0, mapBusinessHoursForm_1.defaultWorkHours)())
            .filter(({ open }) => !!open)
            .map(({ day, start: { time: startTime }, finish: { time: finishTime }, open }) => ({
            day,
            start: { time: startTime },
            finish: { time: finishTime },
            open,
        })),
        departmentsToApplyBusinessHour: '',
        active: (businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.active) || true,
        departments: ((_b = businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData.departments) === null || _b === void 0 ? void 0 : _b.map(({ _id, name }) => ({ value: _id, label: name }))) || [],
    });
};
const EditBusinessHours = ({ businessHourData, type }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const isSingleBH = (0, useIsSingleBusinessHours_1.useIsSingleBusinessHours)();
    const saveBusinessHour = (0, ui_contexts_1.useMethod)('livechat:saveBusinessHour');
    const handleRemove = (0, useRemoveBusinessHour_1.useRemoveBusinessHour)();
    const router = (0, ui_contexts_1.useRouter)();
    const methods = (0, react_hook_form_1.useForm)({ values: getInitialData(businessHourData) });
    const { reset, handleSubmit, formState: { isDirty }, } = methods;
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { departments } = _a, data = __rest(_a, ["departments"]);
        const departmentsToApplyBusinessHour = (departments === null || departments === void 0 ? void 0 : departments.map((dep) => dep.value).join(',')) || '';
        try {
            const payload = Object.assign(Object.assign(Object.assign({}, data), ((businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData._id) && { _id: businessHourData._id })), { type,
                departmentsToApplyBusinessHour, timezone: data.timezoneName, workHours: data.daysTime.map(({ day, start: { time: startTime }, finish: { time: finishTime }, open }) => ({
                    day,
                    start: startTime,
                    finish: finishTime,
                    open,
                })) });
            yield saveBusinessHour(payload);
            dispatchToastMessage({ type: 'success', message: t('Business_hours_updated') });
            router.navigate('/omnichannel/businessHours');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Business_Hours'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [!isSingleBH && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/businessHours'), children: t('Back') }), type === 'custom' && (businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: () => handleRemove(businessHourData === null || businessHourData === void 0 ? void 0 : businessHourData._id, type), children: t('Delete') }))] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: '600px', w: 'full', alignSelf: 'center', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsx)(BusinessHoursForm_1.default, { type: type }) }) })) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', children: t('Save') })] }) })] }));
};
exports.default = EditBusinessHours;
