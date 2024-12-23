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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyOnSubscriptionChangedByRoomIdAndUserIds = exports.notifyOnSubscriptionChangedByUserId = exports.notifyOnSubscriptionChangedByNameAndRoomType = exports.notifyOnSubscriptionChangedByVisitorIds = exports.notifyOnSubscriptionChangedByUserIdAndRoomType = exports.notifyOnSubscriptionChangedByAutoTranslateAndUserId = exports.notifyOnSubscriptionChangedByRoomId = exports.notifyOnSubscriptionChangedByUserPreferences = exports.notifyOnSubscriptionChangedById = exports.notifyOnSubscriptionChangedByRoomIdAndUserId = exports.notifyOnSubscriptionChanged = exports.notifyOnMessageChange = exports.notifyOnUserChangeById = exports.notifyOnUserChangeAsync = exports.notifyOnUserChange = exports.notifyOnSettingChangedById = exports.notifyOnSettingChanged = exports.notifyOnLivechatDepartmentAgentChangedByAgentsAndDepartmentId = exports.notifyOnLivechatDepartmentAgentChangedByDepartmentId = exports.notifyOnLivechatDepartmentAgentChanged = exports.notifyOnIntegrationHistoryChangedById = exports.notifyOnIntegrationHistoryChanged = exports.notifyOnLivechatInquiryChangedByToken = exports.notifyOnLivechatInquiryChangedByRoom = exports.notifyOnLivechatInquiryChangedByVisitorIds = exports.notifyOnLivechatInquiryChangedById = exports.notifyOnLivechatInquiryChanged = exports.notifyOnEmailInboxChanged = exports.notifyOnIntegrationChangedByChannels = exports.notifyOnIntegrationChangedByUserId = exports.notifyOnIntegrationChangedById = exports.notifyOnIntegrationChanged = exports.notifyOnLoginServiceConfigurationChangedByService = exports.notifyOnLoginServiceConfigurationChanged = exports.notifyOnRoleChangedById = exports.notifyOnRoleChanged = exports.notifyOnPbxEventChangedById = exports.notifyOnPermissionChangedById = exports.notifyOnPermissionChanged = exports.notifyOnRoomChangedByUserDM = exports.notifyOnRoomChangedByContactId = exports.notifyOnRoomChangedByUsernamesOrUids = exports.notifyOnRoomChangedById = exports.notifyOnRoomChanged = exports.notifyOnLivechatPriorityChanged = void 0;
exports.getMessageToBroadcast = getMessageToBroadcast;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const publishFields_1 = require("../../../../lib/publishFields");
const hideSystemMessage_1 = require("../../../../server/lib/systemMessage/hideSystemMessage");
function withDbWatcherCheck(fn) {
    return core_services_1.dbWatchersDisabled ? fn : (() => Promise.resolve());
}
exports.notifyOnLivechatPriorityChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated') {
    const { _id } = data, rest = __rest(data, ["_id"]);
    void core_services_1.api.broadcast('watch.priorities', { clientAction, id: _id, diff: Object.assign({}, rest) });
}));
exports.notifyOnRoomChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated') {
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
        void core_services_1.api.broadcast('watch.rooms', { clientAction, room: item });
    }
}));
exports.notifyOnRoomChangedById = withDbWatcherCheck((ids_1, ...args_1) => __awaiter(void 0, [ids_1, ...args_1], void 0, function* (ids, clientAction = 'updated') {
    var _a, e_1, _b, _c;
    const eligibleIds = Array.isArray(ids) ? ids : [ids];
    const items = models_1.Rooms.findByIds(eligibleIds);
    try {
        for (var _d = true, items_1 = __asyncValues(items), items_1_1; items_1_1 = yield items_1.next(), _a = items_1_1.done, !_a; _d = true) {
            _c = items_1_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.rooms', { clientAction, room: item });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_1.return)) yield _b.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}));
exports.notifyOnRoomChangedByUsernamesOrUids = withDbWatcherCheck((uids_1, usernames_1, ...args_1) => __awaiter(void 0, [uids_1, usernames_1, ...args_1], void 0, function* (uids, usernames, clientAction = 'updated') {
    var _a, e_2, _b, _c;
    const items = models_1.Rooms.findByUsernamesOrUids(uids, usernames);
    try {
        for (var _d = true, items_2 = __asyncValues(items), items_2_1; items_2_1 = yield items_2.next(), _a = items_2_1.done, !_a; _d = true) {
            _c = items_2_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.rooms', { clientAction, room: item });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_2.return)) yield _b.call(items_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
}));
exports.notifyOnRoomChangedByContactId = withDbWatcherCheck((contactId_1, ...args_1) => __awaiter(void 0, [contactId_1, ...args_1], void 0, function* (contactId, clientAction = 'updated') {
    const cursor = models_1.LivechatRooms.findOpenByContactId(contactId);
    void cursor.forEach((room) => {
        void core_services_1.api.broadcast('watch.rooms', { clientAction, room });
    });
}));
exports.notifyOnRoomChangedByUserDM = withDbWatcherCheck((userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, clientAction = 'updated') {
    var _a, e_3, _b, _c;
    const items = models_1.Rooms.findDMsByUids([userId]);
    try {
        for (var _d = true, items_3 = __asyncValues(items), items_3_1; items_3_1 = yield items_3.next(), _a = items_3_1.done, !_a; _d = true) {
            _c = items_3_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.rooms', { clientAction, room: item });
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_3.return)) yield _b.call(items_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
}));
exports.notifyOnPermissionChanged = withDbWatcherCheck((permission_1, ...args_1) => __awaiter(void 0, [permission_1, ...args_1], void 0, function* (permission, clientAction = 'updated') {
    void core_services_1.api.broadcast('permission.changed', { clientAction, data: permission });
    if (permission.level === 'settings' && permission.settingId) {
        const setting = yield models_1.Settings.findOneNotHiddenById(permission.settingId);
        if (!setting) {
            return;
        }
        void (0, exports.notifyOnSettingChanged)(setting, 'updated');
    }
}));
exports.notifyOnPermissionChangedById = withDbWatcherCheck((pid_1, ...args_1) => __awaiter(void 0, [pid_1, ...args_1], void 0, function* (pid, clientAction = 'updated') {
    const permission = yield models_1.Permissions.findOneById(pid);
    if (!permission) {
        return;
    }
    return (0, exports.notifyOnPermissionChanged)(permission, clientAction);
}));
exports.notifyOnPbxEventChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated') {
    const item = yield models_1.PbxEvents.findOneById(id);
    if (!item) {
        return;
    }
    void core_services_1.api.broadcast('watch.pbxevents', { clientAction, id, data: item });
}));
exports.notifyOnRoleChanged = withDbWatcherCheck((role_1, ...args_1) => __awaiter(void 0, [role_1, ...args_1], void 0, function* (role, clientAction = 'changed') {
    void core_services_1.api.broadcast('watch.roles', { clientAction, role });
}));
exports.notifyOnRoleChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'changed') {
    const role = yield models_1.Roles.findOneById(id);
    if (!role) {
        return;
    }
    void (0, exports.notifyOnRoleChanged)(role, clientAction);
}));
exports.notifyOnLoginServiceConfigurationChanged = withDbWatcherCheck((service_1, ...args_1) => __awaiter(void 0, [service_1, ...args_1], void 0, function* (service, clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.loginServiceConfiguration', {
        clientAction,
        id: service._id,
        data: service,
    });
}));
exports.notifyOnLoginServiceConfigurationChangedByService = withDbWatcherCheck((service_1, ...args_1) => __awaiter(void 0, [service_1, ...args_1], void 0, function* (service, clientAction = 'updated') {
    const item = yield models_1.LoginServiceConfiguration.findOneByService(service, {
        projection: { secret: 0 },
    });
    if (!item) {
        return;
    }
    void (0, exports.notifyOnLoginServiceConfigurationChanged)(item, clientAction);
}));
exports.notifyOnIntegrationChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.integrations', { clientAction, id: data._id, data });
}));
exports.notifyOnIntegrationChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated') {
    const item = yield models_1.Integrations.findOneById(id);
    if (!item) {
        return;
    }
    void core_services_1.api.broadcast('watch.integrations', { clientAction, id: item._id, data: item });
}));
exports.notifyOnIntegrationChangedByUserId = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated') {
    var _a, e_4, _b, _c;
    const items = models_1.Integrations.findByUserId(id);
    try {
        for (var _d = true, items_4 = __asyncValues(items), items_4_1; items_4_1 = yield items_4.next(), _a = items_4_1.done, !_a; _d = true) {
            _c = items_4_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.integrations', { clientAction, id: item._id, data: item });
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_4.return)) yield _b.call(items_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
}));
exports.notifyOnIntegrationChangedByChannels = withDbWatcherCheck((channels_1, ...args_1) => __awaiter(void 0, [channels_1, ...args_1], void 0, function* (channels, clientAction = 'updated') {
    var _a, e_5, _b, _c;
    const items = models_1.Integrations.findByChannels(channels);
    try {
        for (var _d = true, items_5 = __asyncValues(items), items_5_1; items_5_1 = yield items_5.next(), _a = items_5_1.done, !_a; _d = true) {
            _c = items_5_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.integrations', { clientAction, id: item._id, data: item });
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_5.return)) yield _b.call(items_5);
        }
        finally { if (e_5) throw e_5.error; }
    }
}));
exports.notifyOnEmailInboxChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, // TODO: improve typing
clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.emailInbox', { clientAction, id: data._id, data });
}));
exports.notifyOnLivechatInquiryChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated', diff) {
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
        void core_services_1.api.broadcast('watch.inquiries', { clientAction, inquiry: item, diff });
    }
}));
exports.notifyOnLivechatInquiryChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated', diff) {
    const inquiry = clientAction === 'removed' ? yield models_1.LivechatInquiry.trashFindOneById(id) : yield models_1.LivechatInquiry.findOneById(id);
    if (!inquiry) {
        return;
    }
    void core_services_1.api.broadcast('watch.inquiries', { clientAction, inquiry, diff });
}));
exports.notifyOnLivechatInquiryChangedByVisitorIds = withDbWatcherCheck((visitorIds_1, ...args_1) => __awaiter(void 0, [visitorIds_1, ...args_1], void 0, function* (visitorIds, clientAction = 'updated', diff) {
    const cursor = models_1.LivechatInquiry.findByVisitorIds(visitorIds);
    void cursor.forEach((inquiry) => {
        void core_services_1.api.broadcast('watch.inquiries', { clientAction, inquiry, diff });
    });
}));
exports.notifyOnLivechatInquiryChangedByRoom = withDbWatcherCheck((rid_1, ...args_1) => __awaiter(void 0, [rid_1, ...args_1], void 0, function* (rid, clientAction = 'updated', diff) {
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, {});
    if (!inquiry) {
        return;
    }
    void core_services_1.api.broadcast('watch.inquiries', { clientAction, inquiry, diff });
}));
exports.notifyOnLivechatInquiryChangedByToken = withDbWatcherCheck((token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, clientAction = 'updated', diff) {
    const inquiry = yield models_1.LivechatInquiry.findOneByToken(token);
    if (!inquiry) {
        return;
    }
    void core_services_1.api.broadcast('watch.inquiries', { clientAction, inquiry, diff });
}));
exports.notifyOnIntegrationHistoryChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated', diff = {}) {
    void core_services_1.api.broadcast('watch.integrationHistory', { clientAction, id: data._id, data, diff });
}));
exports.notifyOnIntegrationHistoryChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated', diff = {}) {
    const item = yield models_1.IntegrationHistory.findOneById(id);
    if (!item) {
        return;
    }
    void core_services_1.api.broadcast('watch.integrationHistory', { clientAction, id: item._id, data: item, diff });
}));
exports.notifyOnLivechatDepartmentAgentChanged = withDbWatcherCheck((data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.livechatDepartmentAgents', { clientAction, id: data._id, data });
}));
exports.notifyOnLivechatDepartmentAgentChangedByDepartmentId = withDbWatcherCheck((departmentId_1, ...args_1) => __awaiter(void 0, [departmentId_1, ...args_1], void 0, function* (departmentId, clientAction = 'updated') {
    var _a, e_6, _b, _c;
    const items = models_1.LivechatDepartmentAgents.findByDepartmentId(departmentId, { projection: { _id: 1, agentId: 1, departmentId: 1 } });
    try {
        for (var _d = true, items_6 = __asyncValues(items), items_6_1; items_6_1 = yield items_6.next(), _a = items_6_1.done, !_a; _d = true) {
            _c = items_6_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.livechatDepartmentAgents', { clientAction, id: item._id, data: item });
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_6.return)) yield _b.call(items_6);
        }
        finally { if (e_6) throw e_6.error; }
    }
}));
exports.notifyOnLivechatDepartmentAgentChangedByAgentsAndDepartmentId = withDbWatcherCheck((agentsIds_1, departmentId_1, ...args_1) => __awaiter(void 0, [agentsIds_1, departmentId_1, ...args_1], void 0, function* (agentsIds, departmentId, clientAction = 'updated') {
    var _a, e_7, _b, _c;
    const items = models_1.LivechatDepartmentAgents.findByAgentsAndDepartmentId(agentsIds, departmentId, {
        projection: { _id: 1, agentId: 1, departmentId: 1 },
    });
    try {
        for (var _d = true, items_7 = __asyncValues(items), items_7_1; items_7_1 = yield items_7.next(), _a = items_7_1.done, !_a; _d = true) {
            _c = items_7_1.value;
            _d = false;
            const item = _c;
            void core_services_1.api.broadcast('watch.livechatDepartmentAgents', { clientAction, id: item._id, data: item });
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = items_7.return)) yield _b.call(items_7);
        }
        finally { if (e_7) throw e_7.error; }
    }
}));
exports.notifyOnSettingChanged = withDbWatcherCheck((setting_1, ...args_1) => __awaiter(void 0, [setting_1, ...args_1], void 0, function* (setting, clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.settings', { clientAction, setting });
}));
exports.notifyOnSettingChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated') {
    const item = clientAction === 'removed' ? yield models_1.Settings.trashFindOneById(id) : yield models_1.Settings.findOneById(id);
    if (!item) {
        return;
    }
    void core_services_1.api.broadcast('watch.settings', { clientAction, setting: item });
}));
exports.notifyOnUserChange = withDbWatcherCheck((_a) => __awaiter(void 0, [_a], void 0, function* ({ clientAction, id, data, diff, unset }) {
    if (clientAction === 'removed') {
        void core_services_1.api.broadcast('watch.users', { clientAction, id });
        return;
    }
    if (clientAction === 'inserted') {
        void core_services_1.api.broadcast('watch.users', { clientAction, id, data: data });
        return;
    }
    void core_services_1.api.broadcast('watch.users', { clientAction, diff: diff, unset: unset || {}, id });
}));
/**
 * Calls the callback only if DB Watchers are disabled
 */
exports.notifyOnUserChangeAsync = withDbWatcherCheck((cb) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cb();
    if (!result) {
        return;
    }
    if (Array.isArray(result)) {
        result.forEach((n) => (0, exports.notifyOnUserChange)(n));
        return;
    }
    return (0, exports.notifyOnUserChange)(result);
}));
// TODO this may be only useful on 'inserted'
exports.notifyOnUserChangeById = withDbWatcherCheck((_a) => __awaiter(void 0, [_a], void 0, function* ({ clientAction, id }) {
    const user = yield models_1.Users.findOneById(id);
    if (!user) {
        return;
    }
    void (0, exports.notifyOnUserChange)({ id, clientAction, data: user });
}));
const getUserNameCached = (0, mem_1.default)((userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.Users.findOne(userId, { projection: { name: 1 } });
    return user === null || user === void 0 ? void 0 : user.name;
}), { maxAge: 10000 });
const getSettingCached = (0, mem_1.default)((setting) => __awaiter(void 0, void 0, void 0, function* () { return models_1.Settings.getValueById(setting); }), { maxAge: 10000 });
function getMessageToBroadcast(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, data }) {
        var _b, e_8, _c, _d;
        var _e, _f;
        const message = data !== null && data !== void 0 ? data : (yield models_1.Messages.findOneById(id));
        if (!message) {
            return;
        }
        if (message.t) {
            const hiddenSystemMessages = (yield getSettingCached('Hide_System_Messages'));
            const shouldHide = (0, hideSystemMessage_1.shouldHideSystemMessage)(message.t, hiddenSystemMessages);
            if (shouldHide) {
                return;
            }
        }
        if (message._hidden || message.imported != null) {
            return;
        }
        const useRealName = (yield getSettingCached('UI_Use_Real_Name')) === true;
        if (useRealName) {
            if ((_e = message.u) === null || _e === void 0 ? void 0 : _e._id) {
                const name = yield getUserNameCached(message.u._id);
                if (name) {
                    message.u.name = name;
                }
            }
            if ((_f = message.mentions) === null || _f === void 0 ? void 0 : _f.length) {
                try {
                    for (var _g = true, _h = __asyncValues(message.mentions), _j; _j = yield _h.next(), _b = _j.done, !_b; _g = true) {
                        _d = _j.value;
                        _g = false;
                        const mention = _d;
                        const name = yield getUserNameCached(mention._id);
                        if (name) {
                            mention.name = name;
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (!_g && !_b && (_c = _h.return)) yield _c.call(_h);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
        }
        return message;
    });
}
exports.notifyOnMessageChange = withDbWatcherCheck((_a) => __awaiter(void 0, [_a], void 0, function* ({ id, data }) {
    const message = yield getMessageToBroadcast({ id, data });
    if (!message) {
        return;
    }
    void core_services_1.api.broadcast('watch.messages', { message });
}));
exports.notifyOnSubscriptionChanged = withDbWatcherCheck((subscription_1, ...args_1) => __awaiter(void 0, [subscription_1, ...args_1], void 0, function* (subscription, clientAction = 'updated') {
    void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
}));
exports.notifyOnSubscriptionChangedByRoomIdAndUserId = withDbWatcherCheck((rid_1, uid_1, ...args_1) => __awaiter(void 0, [rid_1, uid_1, ...args_1], void 0, function* (rid, uid, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByUserIdAndRoomIds(uid, [rid], { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedById = withDbWatcherCheck((id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, clientAction = 'updated') {
    const subscription = yield models_1.Subscriptions.findOneById(id);
    if (!subscription) {
        return;
    }
    void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
}));
exports.notifyOnSubscriptionChangedByUserPreferences = withDbWatcherCheck((uid_1, notificationOriginField_1, originFieldNotEqualValue_1, ...args_1) => __awaiter(void 0, [uid_1, notificationOriginField_1, originFieldNotEqualValue_1, ...args_1], void 0, function* (uid, notificationOriginField, originFieldNotEqualValue, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByUserPreferences(uid, notificationOriginField, originFieldNotEqualValue, {
        projection: publishFields_1.subscriptionFields,
    });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByRoomId = withDbWatcherCheck((rid_1, ...args_1) => __awaiter(void 0, [rid_1, ...args_1], void 0, function* (rid, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByRoomId(rid, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByAutoTranslateAndUserId = withDbWatcherCheck((uid_1, ...args_1) => __awaiter(void 0, [uid_1, ...args_1], void 0, function* (uid, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByAutoTranslateAndUserId(uid, true, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByUserIdAndRoomType = withDbWatcherCheck((uid_1, t_1, ...args_1) => __awaiter(void 0, [uid_1, t_1, ...args_1], void 0, function* (uid, t, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByUserIdAndRoomType(uid, t, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByVisitorIds = withDbWatcherCheck((visitorIds_1, ...args_1) => __awaiter(void 0, [visitorIds_1, ...args_1], void 0, function* (visitorIds, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findOpenByVisitorIds(visitorIds, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByNameAndRoomType = withDbWatcherCheck((filter_1, ...args_1) => __awaiter(void 0, [filter_1, ...args_1], void 0, function* (filter, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByNameAndRoomType(filter, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByUserId = withDbWatcherCheck((uid_1, ...args_1) => __awaiter(void 0, [uid_1, ...args_1], void 0, function* (uid, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByUserId(uid, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
exports.notifyOnSubscriptionChangedByRoomIdAndUserIds = withDbWatcherCheck((rid_1, uids_1, ...args_1) => __awaiter(void 0, [rid_1, uids_1, ...args_1], void 0, function* (rid, uids, clientAction = 'updated') {
    const cursor = models_1.Subscriptions.findByRoomIdAndUserIds(rid, uids, { projection: publishFields_1.subscriptionFields });
    void cursor.forEach((subscription) => {
        void core_services_1.api.broadcast('watch.subscriptions', { clientAction, subscription });
    });
}));
