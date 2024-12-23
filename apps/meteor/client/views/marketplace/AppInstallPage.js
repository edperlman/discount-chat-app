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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useInstallApp_1 = require("./hooks/useInstallApp");
const Page_1 = require("../../components/Page");
const useSingleFileInput_1 = require("../../hooks/useSingleFileInput");
const AppInstallPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const { control, setValue, watch } = (0, react_hook_form_1.useForm)();
    const { file } = watch();
    const { install, isInstalling } = (0, useInstallApp_1.useInstallApp)(file);
    const [handleUploadButtonClick] = (0, useSingleFileInput_1.useSingleFileInput)((value) => setValue('file', value), 'app');
    const handleCancel = (0, react_1.useCallback)(() => {
        router.navigate({
            name: 'marketplace',
            params: {
                context: 'private',
                page: 'list',
            },
        });
    }, [router]);
    const fileField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('App_Installation') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { display: 'flex', flexDirection: 'column', alignSelf: 'center', maxWidth: 'x600', w: 'full', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fileField, children: t('App_Url_to_Install_From_File') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'file', control: control, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: fileField, readOnly: true }, field, { value: ((_a = field.value) === null || _a === void 0 ? void 0 : _a.name) || '', addon: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'upload', small: true, primary: true, onClick: handleUploadButtonClick, mb: 'neg-x4', mie: 'neg-x8', children: t('Browse_Files') }) })));
                                        } }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !(file === null || file === void 0 ? void 0 : file.name), loading: isInstalling, onClick: install, children: t('Install') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleCancel, children: t('Cancel') })] }) })] }) })] }));
};
exports.default = AppInstallPage;
