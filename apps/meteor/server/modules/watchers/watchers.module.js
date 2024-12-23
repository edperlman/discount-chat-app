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
exports.isWatcherRunning = isWatcherRunning;
exports.initWatchers = initWatchers;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const publishFields_1 = require("../../../lib/publishFields");
const hasKeys = (requiredKeys) => (data) => {
    if (!data) {
        return false;
    }
    return Object.keys(data)
        .filter((key) => key !== '_id')
        .map((key) => key.split('.')[0])
        .some((key) => requiredKeys.includes(key));
};
const hasRoomFields = hasKeys(Object.keys(publishFields_1.roomFields));
const hasSubscriptionFields = hasKeys(Object.keys(publishFields_1.subscriptionFields));
let watcherStarted = false;
function isWatcherRunning() {
    return watcherStarted;
}
function initWatchers(watcher, broadcast) {
    // watch for changes on the database and broadcast them to the other instances
    if (!core_services_1.dbWatchersDisabled) {
        watcher.on(models_1.Messages.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data }) {
            switch (clientAction) {
                case 'inserted':
                case 'updated':
                    const message = yield (0, notifyListener_1.getMessageToBroadcast)({ id, data });
                    if (!message) {
                        return;
                    }
                    void broadcast('watch.messages', { message });
                    break;
            }
        }));
    }
    watcher.on(models_1.Subscriptions.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        switch (clientAction) {
            case 'inserted':
            case 'updated': {
                if (!hasSubscriptionFields(data || diff)) {
                    return;
                }
                // Override data cuz we do not publish all fields
                const subscription = data ||
                    (yield models_1.Subscriptions.findOneById(id, {
                        projection: publishFields_1.subscriptionFields,
                    }));
                if (!subscription) {
                    return;
                }
                void broadcast('watch.subscriptions', { clientAction, subscription });
                break;
            }
            case 'removed': {
                const trash = (yield models_1.Subscriptions.trashFindOneById(id, {
                    projection: { u: 1, rid: 1, t: 1 },
                }));
                const subscription = trash || { _id: id };
                void broadcast('watch.subscriptions', { clientAction, subscription });
                break;
            }
        }
    }));
    watcher.on(models_1.Roles.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        if (diff && Object.keys(diff).length === 1 && diff._updatedAt) {
            // avoid useless changes
            return;
        }
        if (clientAction === 'removed') {
            void broadcast('watch.roles', {
                clientAction: 'removed',
                role: {
                    _id: id,
                    name: id,
                },
            });
            return;
        }
        const role = data || (yield models_1.Roles.findOneById(id));
        if (!role) {
            return;
        }
        void broadcast('watch.roles', {
            clientAction: 'changed',
            role,
        });
    }));
    watcher.on(models_1.LivechatInquiry.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        var _b, _c;
        switch (clientAction) {
            case 'inserted':
            case 'updated':
                data = (_b = data !== null && data !== void 0 ? data : (yield models_1.LivechatInquiry.findOneById(id))) !== null && _b !== void 0 ? _b : undefined;
                break;
            case 'removed':
                data = (_c = (yield models_1.LivechatInquiry.trashFindOneById(id))) !== null && _c !== void 0 ? _c : undefined;
                break;
        }
        if (!data) {
            return;
        }
        void broadcast('watch.inquiries', { clientAction, inquiry: data, diff });
    }));
    watcher.on(models_1.LivechatDepartmentAgents.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, diff }) {
        if (clientAction === 'removed') {
            const data = yield models_1.LivechatDepartmentAgents.trashFindOneById(id, {
                projection: { agentId: 1, departmentId: 1 },
            });
            if (!data) {
                return;
            }
            void broadcast('watch.livechatDepartmentAgents', { clientAction, id, data, diff });
            return;
        }
        const data = yield models_1.LivechatDepartmentAgents.findOneById(id, {
            projection: { agentId: 1, departmentId: 1 },
        });
        if (!data) {
            return;
        }
        void broadcast('watch.livechatDepartmentAgents', { clientAction, id, data, diff });
    }));
    watcher.on(models_1.Permissions.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data: eventData, diff }) {
        if (diff && Object.keys(diff).length === 1 && diff._updatedAt) {
            // avoid useless changes
            return;
        }
        let data;
        switch (clientAction) {
            case 'updated':
            case 'inserted':
                data = eventData !== null && eventData !== void 0 ? eventData : (yield models_1.Permissions.findOneById(id));
                break;
            case 'removed':
                data = { _id: id, roles: [] };
                break;
        }
        if (!data) {
            return;
        }
        void broadcast('permission.changed', { clientAction, data });
        if (data.level === 'settings' && data.settingId) {
            // if the permission changes, the effect on the visible settings depends on the role affected.
            // The selected-settings-based consumers have to react accordingly and either add or remove the
            // setting from the user's collection
            const setting = yield models_1.Settings.findOneNotHiddenById(data.settingId);
            if (!setting) {
                return;
            }
            void broadcast('watch.settings', { clientAction: 'updated', setting });
        }
    }));
    watcher.on(models_1.Settings.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        if (diff && Object.keys(diff).length === 1 && diff._updatedAt) {
            // avoid useless changes
            return;
        }
        let setting;
        switch (clientAction) {
            case 'updated':
            case 'inserted': {
                setting = data !== null && data !== void 0 ? data : (yield models_1.Settings.findOneById(id));
                break;
            }
            case 'removed': {
                setting = data !== null && data !== void 0 ? data : (yield models_1.Settings.trashFindOneById(id));
                break;
            }
        }
        if (!setting) {
            return;
        }
        void broadcast('watch.settings', { clientAction, setting });
    }));
    watcher.on(models_1.Rooms.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        if (clientAction === 'removed') {
            void broadcast('watch.rooms', { clientAction, room: { _id: id } });
            return;
        }
        if (!hasRoomFields(data || diff)) {
            return;
        }
        const room = data !== null && data !== void 0 ? data : (yield models_1.Rooms.findOneById(id, { projection: publishFields_1.roomFields }));
        if (!room) {
            return;
        }
        void broadcast('watch.rooms', { clientAction, room });
    }));
    // TODO: Prevent flood from database on username change, what causes changes on all past messages from that user
    // and most of those messages are not loaded by the clients.
    watcher.on(models_1.Users.getCollectionName(), ({ clientAction, id, data, diff, unset }) => {
        // LivechatCount is updated each time an agent is routed to a chat. This prop is not used on the UI so we don't need
        // to broadcast events originated by it when it's the only update on the user
        if (diff && Object.keys(diff).length === 1 && 'livechatCount' in diff) {
            return;
        }
        if (clientAction === 'removed') {
            void broadcast('watch.users', { clientAction, id });
            return;
        }
        if (clientAction === 'inserted') {
            void broadcast('watch.users', { clientAction, id, data: data });
            return;
        }
        void broadcast('watch.users', { clientAction, diff: diff, unset: unset, id });
    });
    watcher.on(models_1.LoginServiceConfiguration.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id }) {
        if (clientAction === 'removed') {
            void broadcast('watch.loginServiceConfiguration', { clientAction, id });
            return;
        }
        const data = yield models_1.LoginServiceConfiguration.findOne(id, { projection: { secret: 0 } });
        if (!data) {
            return;
        }
        void broadcast('watch.loginServiceConfiguration', { clientAction, data, id });
    }));
    watcher.on(models_1.InstanceStatus.getCollectionName(), ({ clientAction, id, data, diff }) => {
        if (clientAction === 'removed') {
            void broadcast('watch.instanceStatus', { clientAction, id, data: { _id: id } });
            return;
        }
        void broadcast('watch.instanceStatus', { clientAction, data, diff, id });
    });
    watcher.on(models_1.IntegrationHistory.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data, diff }) {
        switch (clientAction) {
            case 'updated': {
                const history = yield models_1.IntegrationHistory.findOneById(id, {
                    projection: { 'integration._id': 1 },
                });
                if (!(history === null || history === void 0 ? void 0 : history.integration)) {
                    return;
                }
                void broadcast('watch.integrationHistory', { clientAction, data: history, diff, id });
                break;
            }
            case 'inserted': {
                if (!data) {
                    return;
                }
                void broadcast('watch.integrationHistory', { clientAction, data, diff, id });
                break;
            }
        }
    }));
    watcher.on(models_1.Integrations.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data: eventData }) {
        if (clientAction === 'removed') {
            void broadcast('watch.integrations', { clientAction, id, data: { _id: id } });
            return;
        }
        const data = eventData !== null && eventData !== void 0 ? eventData : (yield models_1.Integrations.findOneById(id));
        if (!data) {
            return;
        }
        void broadcast('watch.integrations', { clientAction, data, id });
    }));
    watcher.on(models_1.EmailInbox.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data: eventData }) {
        if (clientAction === 'removed') {
            void broadcast('watch.emailInbox', { clientAction, id, data: { _id: id } });
            return;
        }
        const data = eventData !== null && eventData !== void 0 ? eventData : (yield models_1.EmailInbox.findOneById(id));
        if (!data) {
            return;
        }
        void broadcast('watch.emailInbox', { clientAction, data, id });
    }));
    watcher.on(models_1.PbxEvents.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, data: eventData }) {
        // For now, we just care about insertions here
        if (clientAction === 'inserted') {
            const data = eventData !== null && eventData !== void 0 ? eventData : (yield models_1.PbxEvents.findOneById(id));
            if (!data || !['ContactStatus', 'Hangup'].includes(data.event)) {
                // For now, we'll only care about agent connect/disconnect events
                // Other events are not handled by watchers but by service
                return;
            }
            void broadcast('watch.pbxevents', { clientAction, data, id });
        }
    }));
    watcher.on(models_1.LivechatPriority.getCollectionName(), (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, id, diff }) {
        if (clientAction !== 'updated' || !diff || !('name' in diff)) {
            // For now, we don't support this actions from happening
            return;
        }
        // This solves the problem of broadcasting, since now, watcher is the one in charge of doing it.
        // What i don't like is the idea of giving more responsibilities to watcher, even when this works
        void broadcast('watch.priorities', { clientAction, id, diff });
    }));
    watcherStarted = true;
}
