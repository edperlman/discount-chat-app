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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const BaseGroupPage_1 = __importDefault(require("./BaseGroupPage"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const useExternalLink_1 = require("../../../../hooks/useExternalLink");
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
function LDAPGroupPage(_a) {
    var { _id, i18nLabel, onClickBack } = _a, group = __rest(_a, ["_id", "i18nLabel", "onClickBack"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const testConnection = (0, ui_contexts_1.useEndpoint)('POST', '/v1/ldap.testConnection');
    const syncNow = (0, ui_contexts_1.useEndpoint)('POST', '/v1/ldap.syncNow');
    const testSearch = (0, ui_contexts_1.useEndpoint)('POST', '/v1/ldap.testSearch');
    const ldapEnabled = (0, ui_contexts_1.useSetting)('LDAP_Enable');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal());
    const handleLinkClick = (0, useExternalLink_1.useExternalLink)();
    const editableSettings = (0, EditableSettingsContext_1.useEditableSettings)((0, react_1.useMemo)(() => ({
        group: _id,
    }), [_id]));
    const changed = (0, react_1.useMemo)(() => editableSettings.some(({ changed }) => changed), [editableSettings]);
    const handleTestConnectionButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { message } = yield testConnection();
            dispatchToastMessage({ type: 'success', message: t(message) });
        }
        catch (error) {
            error instanceof Error && dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const handleSyncNowButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield testConnection();
            const confirmSync = () => __awaiter(this, void 0, void 0, function* () {
                closeModal();
                try {
                    const { message } = yield syncNow();
                    dispatchToastMessage({ type: 'success', message: t(message) });
                }
                catch (error) {
                    error instanceof Error && dispatchToastMessage({ type: 'error', message: error });
                }
            });
            setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'info', confirmText: t('Sync'), cancelText: t('Cancel'), title: t('Execute_Synchronization_Now'), onConfirm: confirmSync, onClose: closeModal, children: t('LDAP_Sync_Now_Description') }));
        }
        catch (error) {
            error instanceof Error && dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const handleSearchTestButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield testConnection();
            let username = '';
            const handleChangeUsername = (event) => {
                username = event.currentTarget.value;
            };
            const confirmSearch = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { message } = yield testSearch({ username });
                    dispatchToastMessage({ type: 'success', message: t(message) });
                }
                catch (error) {
                    error instanceof Error && dispatchToastMessage({ type: 'error', message: error });
                }
            });
            setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: (e) => {
                        e.preventDefault();
                        confirmSearch();
                    } }, props))), variant: 'info', confirmText: t('Search'), cancelText: t('Cancel'), title: t('Test_LDAP_Search'), onClose: closeModal, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('LDAP_Username_To_Search') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { onChange: handleChangeUsername }) })] }) }));
        }
        catch (error) {
            error instanceof Error && dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsx)(BaseGroupPage_1.default, Object.assign({ _id: _id, i18nLabel: i18nLabel, onClickBack: onClickBack }, group, { headerButtons: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: t('Test_Connection'), disabled: !ldapEnabled || changed, onClick: handleTestConnectionButtonClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: t('Test_LDAP_Search'), disabled: !ldapEnabled || changed, onClick: handleSearchTestButtonClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: t('LDAP_Sync_Now'), disabled: !ldapEnabled || changed, onClick: handleSyncNowButtonClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { role: 'link', onClick: () => handleLinkClick('https://go.rocket.chat/i/ldap-docs'), children: t('LDAP_Documentation') })] }) })));
}
exports.default = (0, react_1.memo)(LDAPGroupPage);
