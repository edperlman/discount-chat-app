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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const PreferencesGlobalSection_1 = __importDefault(require("./PreferencesGlobalSection"));
const PreferencesHighlightsSection_1 = __importDefault(require("./PreferencesHighlightsSection"));
const PreferencesLocalizationSection_1 = __importDefault(require("./PreferencesLocalizationSection"));
const PreferencesMessagesSection_1 = __importDefault(require("./PreferencesMessagesSection"));
const PreferencesMyDataSection_1 = __importDefault(require("./PreferencesMyDataSection"));
const PreferencesNotificationsSection_1 = __importDefault(require("./PreferencesNotificationsSection"));
const PreferencesSoundSection_1 = __importDefault(require("./PreferencesSoundSection"));
const PreferencesUserPresenceSection_1 = __importDefault(require("./PreferencesUserPresenceSection"));
const useAccountPreferencesValues_1 = require("./useAccountPreferencesValues");
const Page_1 = require("../../../components/Page");
const getDirtyFields_1 = require("../../../lib/getDirtyFields");
const AccountPreferencesPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const dataDownloadEnabled = (0, ui_contexts_1.useSetting)('UserData_EnableDownload');
    const preferencesValues = (0, useAccountPreferencesValues_1.useAccountPreferencesValues)();
    const methods = (0, react_hook_form_1.useForm)({ defaultValues: preferencesValues });
    const { handleSubmit, reset, watch, formState: { isDirty, dirtyFields }, } = methods;
    const currentData = watch();
    const setPreferencesEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const setPreferencesAction = (0, react_query_1.useMutation)({
        mutationFn: setPreferencesEndpoint,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Preferences_saved') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => reset(currentData),
    });
    const handleSaveData = (formData) => __awaiter(void 0, void 0, void 0, function* () {
        const _a = (0, getDirtyFields_1.getDirtyFields)(formData, dirtyFields), { highlights, dontAskAgainList } = _a, data = __rest(_a, ["highlights", "dontAskAgainList"]);
        if (highlights || highlights === '') {
            Object.assign(data, {
                highlights: typeof highlights === 'string' &&
                    highlights
                        .split(/,|\n/)
                        .map((val) => val.trim())
                        .filter(Boolean),
            });
        }
        if (dontAskAgainList) {
            const list = Array.isArray(dontAskAgainList) && dontAskAgainList.length > 0
                ? dontAskAgainList.map(([action, label]) => ({ action, label }))
                : [];
            Object.assign(data, { dontAskAgainList: list });
        }
        setPreferencesAction.mutateAsync({ data });
    });
    const preferencesFormId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Preferences') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { id: preferencesFormId, is: 'form', maxWidth: 'x600', w: 'full', alignSelf: 'center', onSubmit: handleSubmit(handleSaveData), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(0, jsx_runtime_1.jsx)(PreferencesLocalizationSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesGlobalSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesUserPresenceSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesNotificationsSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesMessagesSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesHighlightsSection_1.default, {}), (0, jsx_runtime_1.jsx)(PreferencesSoundSection_1.default, {}), dataDownloadEnabled && (0, jsx_runtime_1.jsx)(PreferencesMyDataSection_1.default, {})] }) }) })) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(preferencesValues), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: preferencesFormId, primary: true, type: 'submit', children: t('Save_changes') })] }) })] }));
};
exports.default = AccountPreferencesPage;
