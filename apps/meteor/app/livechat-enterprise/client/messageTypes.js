"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../ui-utils/client");
const i18n_1 = require("../../utils/lib/i18n");
client_1.MessageTypes.registerType({
    id: 'livechat_transfer_history_fallback',
    system: true,
    message: 'New_chat_transfer_fallback',
    data(message) {
        if (!message.transferData) {
            return {
                fallback: 'SHOULD_NEVER_HAPPEN',
            };
        }
        const from = message.transferData.prevDepartment;
        const to = message.transferData.department.name;
        return {
            fallback: (0, i18n_1.t)('Livechat_transfer_failed_fallback', { from, to }),
        };
    },
});
client_1.MessageTypes.registerType({
    id: 'omnichannel_priority_change_history',
    system: true,
    message: 'omnichannel_priority_change_history',
    data(message) {
        if (!message.priorityData) {
            return {
                user: (0, i18n_1.t)('Unknown_User'),
                priority: (0, i18n_1.t)('Without_priority'),
            };
        }
        const { definedBy: { username }, priority: { name = null, i18n } = {}, } = message.priorityData;
        return {
            user: username || (0, i18n_1.t)('Unknown_User'),
            priority: name || (i18n && (0, i18n_1.t)(i18n)) || (0, i18n_1.t)('Unprioritized'),
        };
    },
});
client_1.MessageTypes.registerType({
    id: 'omnichannel_sla_change_history',
    system: true,
    message: 'omnichannel_sla_change_history',
    data(message) {
        if (!message.slaData) {
            return {
                user: (0, i18n_1.t)('Unknown_User'),
                priority: (0, i18n_1.t)('Without_SLA'),
            };
        }
        const { definedBy: { username }, sla: { name = null } = {}, } = message.slaData;
        return {
            user: username || (0, i18n_1.t)('Unknown_User'),
            sla: name || (0, i18n_1.t)('Without_SLA'),
        };
    },
});
