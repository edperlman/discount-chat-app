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
exports.useDeleteUserAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useConfirmOwnerChanges_1 = require("./useConfirmOwnerChanges");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const useDeleteUserAction = (userId, onChange, onReload) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const userRoute = (0, ui_contexts_1.useRoute)('admin-users');
    const canDeleteUser = (0, ui_contexts_1.usePermission)('delete-user');
    const erasureType = (0, ui_contexts_1.useSetting)('Message_ErasureType');
    const confirmOwnerChanges = (0, useConfirmOwnerChanges_1.useConfirmOwnerChanges)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleDeletedUser = () => {
        setModal();
        userRoute.push({});
        onReload();
    };
    const deleteUserQuery = (0, react_1.useMemo)(() => ({ userId, confirmRelinquish: false }), [userId]);
    const deleteUserEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.delete');
    const deleteUser = () => confirmOwnerChanges((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (confirm = false) {
        if (confirm) {
            deleteUserQuery.confirmRelinquish = confirm;
        }
        try {
            yield deleteUserEndpoint(deleteUserQuery);
            dispatchToastMessage({ type: 'success', message: t('User_has_been_deleted') });
            handleDeletedUser();
        }
        catch (error) {
            throw error;
        }
    }), {
        contentTitle: t(`Delete_User_Warning_${erasureType}`),
        confirmText: t('Delete'),
    }, onChange);
    const confirmDeleteUser = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: deleteUser, onCancel: () => setModal(), confirmText: t('Delete'), children: t(`Delete_User_Warning_${erasureType}`) }));
    });
    return canDeleteUser
        ? {
            icon: 'trash',
            label: t('Delete'),
            action: confirmDeleteUser,
        }
        : undefined;
};
exports.useDeleteUserAction = useDeleteUserAction;
