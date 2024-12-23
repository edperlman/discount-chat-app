"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageDeletionIsAllowed = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const getDifference_1 = require("../lib/getDifference");
const useMessageDeletionIsAllowed = (rid, file, uid) => {
    const canForceDelete = (0, ui_contexts_1.usePermission)('force-delete-message', rid);
    const deletionIsEnabled = (0, ui_contexts_1.useSetting)('Message_AllowDeleting');
    const userHasPermissionToDeleteAny = (0, ui_contexts_1.usePermission)('delete-message', rid);
    const userHasPermissionToDeleteOwn = (0, ui_contexts_1.usePermission)('delete-own-message');
    const bypassBlockTimeLimit = (0, ui_contexts_1.usePermission)('bypass-time-limit-edit-and-delete', rid);
    const blockDeleteInMinutes = (0, ui_contexts_1.useSetting)('Message_AllowDeleting_BlockDeleteInMinutes', 0);
    const isDeletionAllowed = (0, react_1.useMemo)(() => {
        if (canForceDelete) {
            return true;
        }
        if (!deletionIsEnabled) {
            return false;
        }
        if (!userHasPermissionToDeleteAny && !userHasPermissionToDeleteOwn) {
            return false;
        }
        const checkTimeframe = (file) => {
            if (!bypassBlockTimeLimit && blockDeleteInMinutes !== 0) {
                if (!file.uploadedAt || !blockDeleteInMinutes) {
                    return false;
                }
                const currentTsDiff = (0, getDifference_1.getDifference)(new Date(), new Date(file.uploadedAt), getDifference_1.MINUTES);
                return currentTsDiff < blockDeleteInMinutes;
            }
            return true;
        };
        const isUserOwnFile = (file) => file.userId === uid;
        if (userHasPermissionToDeleteAny || isUserOwnFile(file)) {
            return checkTimeframe(file);
        }
        return false;
    }, [
        canForceDelete,
        deletionIsEnabled,
        userHasPermissionToDeleteAny,
        userHasPermissionToDeleteOwn,
        blockDeleteInMinutes,
        bypassBlockTimeLimit,
        file,
        uid,
    ]);
    return isDeletionAllowed;
};
exports.useMessageDeletionIsAllowed = useMessageDeletionIsAllowed;
