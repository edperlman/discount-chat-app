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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Contextualbar_1 = require("../../../components/Contextualbar");
const CustomFieldsList = ({ setCustomFields, allCustomFields }) => {
    const { register, watch, control } = (0, react_hook_form_1.useForm)({ mode: 'onChange' });
    // TODO: When we refactor the other CurrentChat's fields to use react-hook-form, we need to change this to use the form controller
    (0, react_1.useEffect)(() => {
        const subscription = watch((value) => setCustomFields(value));
        return () => subscription.unsubscribe();
    }, [setCustomFields, watch]);
    const t = (0, ui_contexts_1.useTranslation)();
    const currentChatsRoute = (0, ui_contexts_1.useRoute)('omnichannel-current-chats');
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Filter_by_Custom_Fields') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => currentChatsRoute.push({ context: '' }) })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { is: 'form', children: allCustomFields
                        .filter((customField) => customField.scope !== 'visitor')
                        .map((customField) => {
                        if (customField.type === 'select') {
                            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: customField.label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: customField._id, control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { options: (customField.options || '').split(',').map((item) => [item, item]) }))) }) })] }, customField._id));
                        }
                        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: customField.label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ flexGrow: 1 }, register(customField._id))) })] }, customField._id));
                    }) })] }) }));
};
exports.default = CustomFieldsList;
