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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const fontSizes_1 = require("./fontSizes");
const useAcessibilityPreferencesValues_1 = require("./hooks/useAcessibilityPreferencesValues");
const useCreateFontStyleElement_1 = require("./hooks/useCreateFontStyleElement");
const themeItems_1 = require("./themeItems");
const Page_1 = require("../../../components/Page");
const getDirtyFields_1 = require("../../../lib/getDirtyFields");
const AccessibilityPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const preferencesValues = (0, useAcessibilityPreferencesValues_1.useAccessiblityPreferencesValues)();
    const createFontStyleElement = (0, useCreateFontStyleElement_1.useCreateFontStyleElement)();
    const displayRolesEnabled = (0, ui_contexts_1.useSetting)('UI_DisplayRoles');
    const timeFormatOptions = (0, react_1.useMemo)(() => [
        ['0', t('Default')],
        ['1', t('12_Hour')],
        ['2', t('24_Hour')],
    ], [t]);
    const pageFormId = (0, fuselage_hooks_1.useUniqueId)();
    const fontSizeId = (0, fuselage_hooks_1.useUniqueId)();
    const mentionsWithSymbolId = (0, fuselage_hooks_1.useUniqueId)();
    const clockModeId = (0, fuselage_hooks_1.useUniqueId)();
    const hideUsernamesId = (0, fuselage_hooks_1.useUniqueId)();
    const hideRolesId = (0, fuselage_hooks_1.useUniqueId)();
    const linkListId = (0, fuselage_hooks_1.useUniqueId)();
    const { formState: { isDirty, dirtyFields, isSubmitting }, handleSubmit, control, reset, watch, } = (0, react_hook_form_1.useForm)({
        defaultValues: preferencesValues,
    });
    const currentData = watch();
    const setUserPreferencesEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const setPreferencesAction = (0, react_query_1.useMutation)({
        mutationFn: setUserPreferencesEndpoint,
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Preferences_saved') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
        onSettled: (_data, _error, { data: { fontSize } }) => {
            reset(currentData);
            dirtyFields.fontSize && fontSize && createFontStyleElement(fontSize);
        },
    });
    const handleSaveData = (formData) => {
        const data = (0, getDirtyFields_1.getDirtyFields)(formData, dirtyFields);
        setPreferencesAction.mutateAsync({ data });
    };
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Accessibility_and_Appearance') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'form', id: pageFormId, onSubmit: handleSubmit(handleSaveData), maxWidth: 'x600', w: 'full', alignSelf: 'center', mb: 40, mi: 36, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p1', mbe: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { pb: 16, is: 'p', children: t('Accessibility_activation') }), (0, jsx_runtime_1.jsx)("p", { id: linkListId, children: t('Learn_more_about_accessibility') }), (0, jsx_runtime_1.jsxs)("ul", { "aria-labelledby": linkListId, children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://go.rocket.chat/i/accessibility-statement', children: t('Accessibility_statement') }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://go.rocket.chat/i/glossary', children: t('Glossary_of_simplified_terms') }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://go.rocket.chat/i/accessibility-and-appearance', children: t('Accessibility_feature_documentation') }) })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: true, title: t('Theme'), children: themeItems_1.themeItems.map(({ id, title, description }, index) => {
                                        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { pbe: themeItems_1.themeItems.length - 1 ? undefined : 'x28', pbs: index === 0 ? undefined : 'x28', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { display: 'flex', alignItems: 'center', htmlFor: id, children: t(title) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'themeAppearence', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { id: id, ref: ref, onChange: () => onChange(id), checked: value === id })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { mbs: 12, style: { whiteSpace: 'break-spaces' }, children: t(description) })] }, id));
                                    }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Adjustable_layout'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fontSizeId, mbe: 12, children: t('Font_size') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'fontSize', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: fontSizeId, value: value, onChange: onChange, options: fontSizes_1.fontSizes })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { mb: 12, children: t('Adjustable_font_size_description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fontSizeId, children: t('Mentions_with_@_symbol') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'mentionsWithSymbol', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: mentionsWithSymbolId, ref: ref, checked: value, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { className: (0, css_in_js_1.css) `
											white-space: break-spaces;
										`, mb: 12, children: t('Mentions_with_@_symbol_description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: clockModeId, children: t('Message_TimeFormat') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'clockMode', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: clockModeId, value: `${value}`, onChange: onChange, options: timeFormatOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: hideUsernamesId, children: t('Show_usernames') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'hideUsernames', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: hideUsernamesId, ref: ref, checked: !value, onChange: (e) => onChange(!e.target.checked) })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { children: t('Show_or_hide_the_username_of_message_authors') })] }), displayRolesEnabled && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: hideRolesId, children: t('Show_roles') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'hideRoles', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: hideRolesId, ref: ref, checked: !value, onChange: (e) => onChange(!e.target.checked) })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { children: t('Show_or_hide_the_user_roles_of_message_authors') })] }))] }) })] })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(preferencesValues), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isDirty, loading: isSubmitting, form: pageFormId, type: 'submit', children: t('Save_changes') })] }) })] }));
};
exports.default = AccessibilityPage;
