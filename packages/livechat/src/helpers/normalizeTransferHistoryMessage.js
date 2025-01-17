"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTransferHistoryMessage = void 0;
const normalizeTransferHistoryMessage = (transferData, sender, t) => {
    if (!transferData) {
        return;
    }
    const { transferredBy, transferredTo, nextDepartment, scope, comment } = transferData;
    const from = transferredBy && (transferredBy.name || transferredBy.username);
    const transferTypes = {
        agent: () => {
            if (!sender.username) {
                return t('the_chat_was_transferred_to_another_agent');
            }
            const to = transferredTo && (transferredTo.name || transferredTo.username);
            return t('from_transferred_the_chat_to_to', { from, to });
        },
        department: () => {
            const to = nextDepartment === null || nextDepartment === void 0 ? void 0 : nextDepartment.name;
            if (!sender.username) {
                return t('the_agent_transferred_the_chat_to_the_department_to', { to });
            }
            return t('from_transferred_the_chat_to_the_department_to', { from, to });
        },
        queue: () => {
            if (!sender.username) {
                return t('the_chat_was_moved_back_to_queue');
            }
            return t('from_returned_the_chat_to_the_queue', { from, interpolation: { escapeValue: false } });
        },
        autoTransferUnansweredChatsToAgent: () => t('the_chat_was_transferred_to_another_agent_due_to_unanswered', { duration: comment }),
        autoTransferUnansweredChatsToQueue: () => t('the_chat_was_moved_back_to_queue_due_to_unanswered', { duration: comment }),
    };
    return transferTypes[scope]();
};
exports.normalizeTransferHistoryMessage = normalizeTransferHistoryMessage;
