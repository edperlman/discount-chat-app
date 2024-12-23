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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const sha256_1 = require("@rocket.chat/sha256");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const AccountProfileForm_1 = __importDefault(require("./AccountProfileForm"));
const ActionConfirmModal_1 = __importDefault(require("./ActionConfirmModal"));
const getProfileInitialValues_1 = require("./getProfileInitialValues");
const ConfirmOwnerChangeModal_1 = __importDefault(require("../../../components/ConfirmOwnerChangeModal"));
const Page_1 = require("../../../components/Page");
const useAllowPasswordChange_1 = require("../security/useAllowPasswordChange");
// TODO: enforce useMutation
const AccountProfilePage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const logout = (0, ui_contexts_1.useLogout)();
    const [loggingOut, setLoggingOut] = (0, react_1.useState)(false);
    const erasureType = (0, ui_contexts_1.useSetting)('Message_ErasureType');
    const allowDeleteOwnAccount = (0, ui_contexts_1.useSetting)('Accounts_AllowDeleteOwnAccount');
    const { hasLocalPassword } = (0, useAllowPasswordChange_1.useAllowPasswordChange)();
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: (0, getProfileInitialValues_1.getProfileInitialValues)(user),
        mode: 'onBlur',
    });
    const { reset, formState: { isDirty, isSubmitting }, } = methods;
    const logoutOtherClients = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.logoutOtherClients');
    const deleteOwnAccount = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.deleteOwnAccount');
    const handleLogoutOtherLocations = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoggingOut(true);
        try {
            yield logoutOtherClients();
            dispatchToastMessage({
                type: 'success',
                message: t('Logged_out_of_other_clients_successfully'),
            });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        setLoggingOut(false);
    }), [logoutOtherClients, dispatchToastMessage, t]);
    const handleConfirmOwnerChange = (0, react_1.useCallback)((passwordOrUsername, shouldChangeOwner, shouldBeRemoved) => {
        const handleConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteOwnAccount({ password: (0, sha256_1.SHA256)(passwordOrUsername), confirmRelinquish: true });
                dispatchToastMessage({ type: 'success', message: t('User_has_been_deleted') });
                setModal(null);
                logout();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        return setModal(() => ((0, jsx_runtime_1.jsx)(ConfirmOwnerChangeModal_1.default, { onConfirm: handleConfirm, onCancel: () => setModal(null), contentTitle: t(`Delete_User_Warning_${erasureType}`), confirmText: t('Delete'), shouldChangeOwner: shouldChangeOwner, shouldBeRemoved: shouldBeRemoved })));
    }, [erasureType, setModal, t, deleteOwnAccount, dispatchToastMessage, logout]);
    const handleDeleteOwnAccount = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const handleConfirm = (passwordOrUsername) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteOwnAccount({ password: (0, sha256_1.SHA256)(passwordOrUsername) });
                dispatchToastMessage({ type: 'success', message: t('User_has_been_deleted') });
                logout();
            }
            catch (error) {
                if (error.error === 'user-last-owner') {
                    const { shouldChangeOwner, shouldBeRemoved } = error.details;
                    return handleConfirmOwnerChange(passwordOrUsername, shouldChangeOwner, shouldBeRemoved);
                }
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        return setModal(() => (0, jsx_runtime_1.jsx)(ActionConfirmModal_1.default, { onConfirm: handleConfirm, onCancel: () => setModal(null), isPassword: hasLocalPassword }));
    }), [dispatchToastMessage, hasLocalPassword, setModal, handleConfirmOwnerChange, deleteOwnAccount, logout, t]);
    const profileFormId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Profile') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: '600px', w: 'full', alignSelf: 'center', children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(AccountProfileForm_1.default, { id: profileFormId }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 12, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleLogoutOtherLocations, flexGrow: 0, loading: loggingOut, children: t('Logout_Others') }), allowDeleteOwnAccount && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: handleDeleteOwnAccount, children: t('Delete_my_account') }))] }) })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !isDirty, onClick: () => reset((0, getProfileInitialValues_1.getProfileInitialValues)(user)), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: profileFormId, "data-qa": 'AccountProfilePageSaveButton', primary: true, disabled: !isDirty || loggingOut, loading: isSubmitting, type: 'submit', children: t('Save_changes') })] }) })] }));
};
exports.default = AccountProfilePage;
