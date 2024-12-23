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
exports.useChangeUserStatusAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useConfirmOwnerChanges_1 = require("./useConfirmOwnerChanges");
const useChangeUserStatusAction = (userId, isActive, onChange) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const confirmOwnerChanges = (0, useConfirmOwnerChanges_1.useConfirmOwnerChanges)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const changeActiveStatusRequest = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setActiveStatus');
    const canEditOtherUserActiveStatus = (0, ui_contexts_1.usePermission)('edit-other-user-active-status');
    const changeActiveStatusMessage = isActive ? 'User_has_been_deactivated' : 'User_has_been_activated';
    const activeStatusQuery = (0, react_1.useMemo)(() => ({
        userId,
        activeStatus: !isActive,
        confirmRelinquish: false,
    }), [userId, isActive]);
    const changeActiveStatus = () => confirmOwnerChanges((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (confirm = false) {
        if (confirm) {
            activeStatusQuery.confirmRelinquish = confirm;
        }
        try {
            yield changeActiveStatusRequest(activeStatusQuery);
            dispatchToastMessage({ type: 'success', message: t(changeActiveStatusMessage) });
            onChange();
        }
        catch (error) {
            throw error;
        }
    }), {
        confirmText: t('Yes_deactivate_it'),
    }, onChange);
    return canEditOtherUserActiveStatus
        ? {
            icon: 'user',
            label: isActive ? t('Deactivate') : t('Activate'),
            action: changeActiveStatus,
        }
        : undefined;
};
exports.useChangeUserStatusAction = useChangeUserStatusAction;
