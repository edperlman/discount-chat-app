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
const react_i18next_1 = require("react-i18next");
const AppearanceForm_1 = __importDefault(require("./AppearanceForm"));
const Page_1 = require("../../../components/Page");
const reduceAppearance = (settings) => settings.reduce((acc, { _id, value }) => {
    acc = Object.assign(Object.assign({}, acc), { [_id]: value });
    return acc;
}, {});
const AppearancePage = ({ settings }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const saveAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/appearance');
    const methods = (0, react_hook_form_1.useForm)({ defaultValues: reduceAppearance(settings) });
    const { reset, formState: { isDirty }, handleSubmit, watch, } = methods;
    const currentData = watch();
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((data) => __awaiter(void 0, void 0, void 0, function* () {
        const mappedAppearance = Object.entries(data)
            .map(([_id, value]) => ({ _id, value }))
            .filter((item) => item.value !== undefined);
        try {
            yield saveAction(mappedAppearance);
            dispatchToastMessage({ type: 'success', message: t('Settings_updated') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            reset(currentData);
        }
    }));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Appearance') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsx)(AppearanceForm_1.default, {}) }) })) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, type: 'submit', primary: true, children: t('Save_changes') })] }) })] }));
};
exports.default = AppearancePage;
