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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangeAdminStatusAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useChangeAdminStatusAction = (userId, isAdmin, onChange) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setAdminStatus = (0, ui_contexts_1.useMethod)('setAdminStatus');
    const canAssignAdminRole = (0, ui_contexts_1.usePermission)('assign-admin-role');
    const changeAdminStatus = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield setAdminStatus(userId, !isAdmin);
            const message = isAdmin ? 'User_is_no_longer_an_admin' : 'User_is_now_an_admin';
            dispatchToastMessage({ type: 'success', message: t(message) });
            onChange();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [userId, dispatchToastMessage, isAdmin, onChange, setAdminStatus, t]);
    return canAssignAdminRole
        ? {
            icon: 'key',
            label: isAdmin ? t('Remove_Admin') : t('Make_Admin'),
            action: changeAdminStatus,
        }
        : undefined;
};
exports.useChangeAdminStatusAction = useChangeAdminStatusAction;
