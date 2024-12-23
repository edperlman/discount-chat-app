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
const getRoomTypeTranslation_1 = require("../../../../../lib/getRoomTypeTranslation");
const RoomContext_1 = require("../../../contexts/RoomContext");
const MessageSearchForm = ({ provider, onSearch }) => {
    const { handleSubmit, register, setFocus, control } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            searchText: '',
            globalSearch: false,
        },
    });
    const room = (0, RoomContext_1.useRoom)();
    (0, react_1.useEffect)(() => {
        setFocus('searchText');
    }, [setFocus]);
    const debouncedOnSearch = (0, fuselage_hooks_1.useDebouncedCallback)((0, fuselage_hooks_1.useMutableCallback)(onSearch), 300);
    const submitHandler = handleSubmit(({ searchText, globalSearch }) => {
        debouncedOnSearch.cancel();
        onSearch({ searchText, globalSearch });
    });
    const searchText = (0, react_hook_form_1.useWatch)({ control, name: 'searchText' });
    const globalSearch = (0, react_hook_form_1.useWatch)({ control, name: 'globalSearch' });
    (0, react_1.useEffect)(() => {
        debouncedOnSearch({ searchText, globalSearch });
    }, [debouncedOnSearch, searchText, globalSearch]);
    const globalSearchEnabled = provider.settings.GlobalSearchEnabled;
    const globalSearchToggleId = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'form', onSubmit: submitHandler, w: 'full', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), placeholder: t('Search_Messages'), "aria-label": t('Search_Messages'), autoComplete: 'off' }, register('searchText'))), provider.description && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { dangerouslySetInnerHTML: { __html: t(provider.description) } })] }), globalSearchEnabled && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: globalSearchToggleId, children: t('Global_Search') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: globalSearchToggleId }, register('globalSearch')))] })), room.encrypted && ((0, jsx_runtime_1.jsxs)(fuselage_1.Callout, { type: 'warning', mbs: 12, icon: 'circle-exclamation', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2b', children: t('Encrypted_RoomType', { roomType: (0, getRoomTypeTranslation_1.getRoomTypeTranslation)(room).toLowerCase() }) }), t('Encrypted_content_cannot_be_searched')] }))] }));
};
exports.default = MessageSearchForm;
