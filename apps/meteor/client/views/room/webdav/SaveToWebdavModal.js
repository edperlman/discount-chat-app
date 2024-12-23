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
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useWebDAVAccountIntegrationsQuery_1 = require("../../../hooks/webdav/useWebDAVAccountIntegrationsQuery");
const getWebdavServerName_1 = require("../../../lib/getWebdavServerName");
const SaveToWebdavModal = ({ onClose, data }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const uploadFileToWebdav = (0, ui_contexts_1.useMethod)('uploadFileToWebdav');
    const fileRequest = (0, react_1.useRef)(null);
    const accountIdField = (0, fuselage_hooks_1.useUniqueId)();
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({ mode: 'all' });
    const enabled = (0, ui_contexts_1.useSetting)('Webdav_Integration_Enabled', false);
    const { data: value } = (0, useWebDAVAccountIntegrationsQuery_1.useWebDAVAccountIntegrationsQuery)({ enabled });
    const accountsOptions = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = value === null || value === void 0 ? void 0 : value.map((_a) => {
            var { _id } = _a, current = __rest(_a, ["_id"]);
            return [_id, (0, getWebdavServerName_1.getWebdavServerName)(current)];
        })) !== null && _a !== void 0 ? _a : [];
    }, [value]);
    (0, react_1.useEffect)(() => { var _a; return (_a = fileRequest.current) === null || _a === void 0 ? void 0 : _a.abort; }, []);
    const handleSaveFile = ({ accountId }) => {
        setIsLoading(true);
        const { url, attachment: { title }, } = data;
        fileRequest.current = new XMLHttpRequest();
        fileRequest.current.open('GET', url, true);
        fileRequest.current.responseType = 'arraybuffer';
        fileRequest.current.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const arrayBuffer = (_a = fileRequest.current) === null || _a === void 0 ? void 0 : _a.response;
            if (arrayBuffer) {
                try {
                    if (!title) {
                        throw new Error('File name is required');
                    }
                    const response = yield uploadFileToWebdav(accountId, arrayBuffer, title);
                    if (!response.success) {
                        throw new Error(response.message ? t(response.message) : 'Error uploading file');
                    }
                    return dispatchToastMessage({ type: 'success', message: t('File_uploaded') });
                }
                catch (error) {
                    return dispatchToastMessage({ type: 'error', message: error });
                }
                finally {
                    setIsLoading(false);
                    onClose();
                }
            }
        });
        fileRequest.current.send(null);
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleSaveFile) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Save_To_Webdav') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { title: t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [isLoading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 'x32', children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {}) })), !isLoading && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Select_a_webdav_server') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'accountId', control: control, rules: { required: t('Required_field', { field: t('Select_a_webdav_server') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { options: accountsOptions, id: accountIdField, placeholder: t('Select_an_option') }))) }) }), errors.accountId && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: errors.accountId.message })] }) }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, type: 'submit', loading: isLoading, children: t('Save_To_Webdav') })] }) })] }));
};
exports.default = SaveToWebdavModal;
