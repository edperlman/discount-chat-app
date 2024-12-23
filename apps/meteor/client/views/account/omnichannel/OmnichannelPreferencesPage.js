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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const PreferencesConversationTranscript_1 = __importDefault(require("./PreferencesConversationTranscript"));
const PreferencesGeneral_1 = require("./PreferencesGeneral");
const Page_1 = require("../../../components/Page");
const OmnichannelPreferencesPage = () => {
    var _a, _b, _c;
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const alwaysSendEmailTranscript = (0, ui_contexts_1.useSetting)('Livechat_transcript_send_always', false);
    const omnichannelTranscriptPDF = (_a = (0, ui_contexts_1.useUserPreference)('omnichannelTranscriptPDF')) !== null && _a !== void 0 ? _a : false;
    const omnichannelTranscriptEmail = (_b = (0, ui_contexts_1.useUserPreference)('omnichannelTranscriptEmail')) !== null && _b !== void 0 ? _b : false;
    const omnichannelHideConversationAfterClosing = (_c = (0, ui_contexts_1.useUserPreference)('omnichannelHideConversationAfterClosing')) !== null && _c !== void 0 ? _c : true;
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: {
            omnichannelTranscriptPDF,
            omnichannelTranscriptEmail: alwaysSendEmailTranscript || omnichannelTranscriptEmail,
            omnichannelHideConversationAfterClosing,
        },
    });
    const { handleSubmit, formState: { isDirty }, reset, } = methods;
    const saveFn = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const handleSave = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield saveFn({ data });
            reset(data);
            dispatchToastMessage({ type: 'success', message: t('Preferences_saved') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Omnichannel') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { is: 'form', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsxs)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: [(0, jsx_runtime_1.jsx)(PreferencesGeneral_1.PreferencesGeneral, {}), (0, jsx_runtime_1.jsx)(PreferencesConversationTranscript_1.default, {})] })) }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset({ omnichannelTranscriptPDF, omnichannelTranscriptEmail }), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isDirty, onClick: handleSubmit(handleSave), children: t('Save_changes') })] }) })] }));
};
exports.default = OmnichannelPreferencesPage;
