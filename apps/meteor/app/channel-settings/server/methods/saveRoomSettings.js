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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoomSettings = saveRoomSettings;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const setRoomAvatar_1 = require("../../../lib/server/functions/setRoomAvatar");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const saveReactWhenReadOnly_1 = require("../functions/saveReactWhenReadOnly");
const saveRoomAnnouncement_1 = require("../functions/saveRoomAnnouncement");
const saveRoomCustomFields_1 = require("../functions/saveRoomCustomFields");
const saveRoomDescription_1 = require("../functions/saveRoomDescription");
const saveRoomEncrypted_1 = require("../functions/saveRoomEncrypted");
const saveRoomName_1 = require("../functions/saveRoomName");
const saveRoomReadOnly_1 = require("../functions/saveRoomReadOnly");
const saveRoomSystemMessages_1 = require("../functions/saveRoomSystemMessages");
const saveRoomTopic_1 = require("../functions/saveRoomTopic");
const saveRoomType_1 = require("../functions/saveRoomType");
const hasRetentionPolicy = (room) => 'retention' in room && room.retention !== undefined;
const validators = {
    default(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-room-administration'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Viewing room administration is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Viewing_room_administration',
                });
            }
        });
    },
    featured(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-room-administration'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Viewing room administration is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Viewing_room_administration',
                });
            }
        });
    },
    sidepanel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ room, userId, value }) {
            if (!room.teamMain) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Invalid room', {
                    method: 'saveRoomSettings',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-team', room._id))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'You do not have permission to change sidepanel items', {
                    method: 'saveRoomSettings',
                });
            }
            if (!(0, core_typings_1.isValidSidepanel)(value)) {
                throw new meteor_1.Meteor.Error('error-invalid-sidepanel');
            }
        });
    },
    roomType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, room, value }) {
            if (value === room.t) {
                return;
            }
            if (value === 'c' && !room.teamId && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-c'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Changing a private group to a public channel is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Change_Room_Type',
                });
            }
            if (value === 'p' && !room.teamId && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-p'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Changing a public channel to a private room is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Change_Room_Type',
                });
            }
            if (!room.teamId) {
                return;
            }
            const team = yield core_services_1.Team.getInfoById(room.teamId);
            if (value === 'c' && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-team-channel', team === null || team === void 0 ? void 0 : team.roomId))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', `Changing a team's private group to a public channel is not allowed`, {
                    method: 'saveRoomSettings',
                    action: 'Change_Room_Type',
                });
            }
            if (value === 'p' && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-team-group', team === null || team === void 0 ? void 0 : team.roomId))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', `Changing a team's public channel to a private room is not allowed`, {
                    method: 'saveRoomSettings',
                    action: 'Change_Room_Type',
                });
            }
        });
    },
    encrypted(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (value !== room.encrypted) {
                if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowRoomSettingChange(room, IRoomTypeConfig_1.RoomSettingsEnum.E2E))) {
                    throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Only groups or direct channels can enable encryption', {
                        method: 'saveRoomSettings',
                        action: 'Change_Room_Encrypted',
                    });
                }
                if (room.t !== 'd' && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'toggle-room-e2e-encryption', rid))) {
                    throw new meteor_1.Meteor.Error('error-action-not-allowed', 'You do not have permission to toggle E2E encryption', {
                        method: 'saveRoomSettings',
                        action: 'Change_Room_Encrypted',
                    });
                }
            }
        });
    },
    retentionEnabled(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-retention-policy', rid)) &&
                (!hasRetentionPolicy(room) || value !== room.retention.enabled)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room retention policy is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
    retentionMaxAge(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-retention-policy', rid)) &&
                (!hasRetentionPolicy(room) || value !== room.retention.maxAge)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room retention policy is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
    retentionExcludePinned(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-retention-policy', rid)) &&
                (!hasRetentionPolicy(room) || value !== room.retention.excludePinned)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room retention policy is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
    retentionFilesOnly(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-retention-policy', rid)) &&
                (!hasRetentionPolicy(room) || value !== room.retention.filesOnly)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room retention policy is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
    retentionIgnoreThreads(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, value, room, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-retention-policy', rid)) &&
                (!hasRetentionPolicy(room) || value !== room.retention.ignoreThreads)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room retention policy is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
    roomAvatar(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, rid }) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room-avatar', rid))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing a room avatar is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
        });
    },
};
const settingSavers = {
    roomName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid, user, room }) {
            if (!(yield (0, saveRoomName_1.saveRoomName)(rid, value, user))) {
                return;
            }
            if (room.teamId && room.teamMain) {
                void core_services_1.Team.update(user._id, room.teamId, {
                    type: room.t === 'c' ? core_typings_1.TEAM_TYPE.PUBLIC : core_typings_1.TEAM_TYPE.PRIVATE,
                    name: value,
                    updateRoom: false,
                });
            }
        });
    },
    roomTopic(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (!value && !room.topic) {
                return;
            }
            if (value !== room.topic) {
                yield (0, saveRoomTopic_1.saveRoomTopic)(rid, value, user);
            }
        });
    },
    sidepanel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid, room }) {
            if (JSON.stringify(value) !== JSON.stringify(room.sidepanel)) {
                yield models_1.Rooms.setSidepanelById(rid, value);
            }
        });
    },
    roomAnnouncement(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (!value && !room.announcement) {
                return;
            }
            if (value !== room.announcement) {
                yield (0, saveRoomAnnouncement_1.saveRoomAnnouncement)(rid, value, user);
            }
        });
    },
    roomCustomFields(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid }) {
            if (value !== room.customFields) {
                yield (0, saveRoomCustomFields_1.saveRoomCustomFields)(rid, value);
            }
        });
    },
    roomDescription(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (!value && !room.description) {
                return;
            }
            if (value !== room.description) {
                yield (0, saveRoomDescription_1.saveRoomDescription)(rid, value, user);
            }
        });
    },
    roomType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (value === room.t) {
                return;
            }
            if (!(yield (0, saveRoomType_1.saveRoomType)(rid, value, user))) {
                return;
            }
            if (room.teamId && room.teamMain) {
                const type = value === 'c' ? core_typings_1.TEAM_TYPE.PUBLIC : core_typings_1.TEAM_TYPE.PRIVATE;
                void core_services_1.Team.update(user._id, room.teamId, { type, updateRoom: false });
            }
        });
    },
    readOnly(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (value !== room.ro) {
                yield (0, saveRoomReadOnly_1.saveRoomReadOnly)(rid, value, user);
            }
        });
    },
    reactWhenReadOnly(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            if (value !== room.reactWhenReadOnly) {
                yield (0, saveReactWhenReadOnly_1.saveReactWhenReadOnly)(rid, value, user);
            }
        });
    },
    systemMessages(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid }) {
            if (JSON.stringify(value) !== JSON.stringify(room.sysMes)) {
                yield (0, saveRoomSystemMessages_1.saveRoomSystemMessages)(rid, value);
            }
        });
    },
    joinCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.setJoinCodeById(rid, String(value));
        });
    },
    default(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveDefaultById(rid, value);
        });
    },
    featured(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveFeaturedById(rid, value);
        });
    },
    retentionEnabled(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionEnabledById(rid, value);
        });
    },
    retentionMaxAge(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionMaxAgeById(rid, value);
        });
    },
    retentionExcludePinned(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionExcludePinnedById(rid, value);
        });
    },
    retentionFilesOnly(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionFilesOnlyById(rid, value);
        });
    },
    retentionIgnoreThreads(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionIgnoreThreadsById(rid, value);
        });
    },
    retentionOverrideGlobal(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveRetentionOverrideGlobalById(rid, value);
        });
    },
    encrypted(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, room, rid, user }) {
            yield (0, saveRoomEncrypted_1.saveRoomEncrypted)(rid, value, user, Boolean(room.encrypted) !== Boolean(value));
        });
    },
    favorite(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid }) {
            yield models_1.Rooms.saveFavoriteById(rid, value.favorite, value.defaultValue);
        });
    },
    roomAvatar(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value, rid, user }) {
            yield (0, setRoomAvatar_1.setRoomAvatar)(rid, value, user);
        });
    },
};
const fields = [
    'roomAvatar',
    'featured',
    'roomName',
    'roomTopic',
    'roomAnnouncement',
    'roomCustomFields',
    'roomDescription',
    'roomType',
    'readOnly',
    'reactWhenReadOnly',
    'systemMessages',
    'default',
    'joinCode',
    'retentionEnabled',
    'retentionMaxAge',
    'retentionExcludePinned',
    'retentionFilesOnly',
    'retentionIgnoreThreads',
    'retentionOverrideGlobal',
    'encrypted',
    'favorite',
    'sidepanel',
];
const validate = (setting, params) => {
    const validator = validators[setting];
    return validator === null || validator === void 0 ? void 0 : validator(params);
};
function save(setting, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const saver = settingSavers[setting];
        yield (saver === null || saver === void 0 ? void 0 : saver(params));
    });
}
function saveRoomSettings(userId, rid, settings, value) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                function: 'RocketChat.saveRoomName',
            });
        }
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                method: 'saveRoomSettings',
            });
        }
        if (typeof settings !== 'object') {
            settings = {
                [settings]: value,
            };
        }
        if (!Object.keys(settings).every((key) => fields.includes(key))) {
            throw new meteor_1.Meteor.Error('error-invalid-settings', 'Invalid settings provided', {
                method: 'saveRoomSettings',
            });
        }
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                method: 'saveRoomSettings',
            });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room', rid))) {
            if (!(Object.keys(settings).includes('encrypted') && room.t === 'd')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing room is not allowed', {
                    method: 'saveRoomSettings',
                    action: 'Editing_room',
                });
            }
            settings = { encrypted: settings.encrypted };
        }
        if (room.broadcast && (settings.readOnly || settings.reactWhenReadOnly)) {
            throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing readOnly/reactWhenReadOnly are not allowed for broadcast rooms', {
                method: 'saveRoomSettings',
                action: 'Editing_room',
            });
        }
        const user = yield models_1.Users.findOneById(userId, { projection: { username: 1, name: 1 } });
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'saveRoomSettings',
            });
        }
        try {
            // validations
            for (var _g = true, _h = __asyncValues(Object.keys(settings)), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                _c = _j.value;
                _g = false;
                const setting = _c;
                yield validate(setting, {
                    userId,
                    value: settings[setting],
                    room,
                    rid,
                });
                if (setting === 'retentionOverrideGlobal' && settings.retentionOverrideGlobal === false) {
                    delete settings.retentionMaxAge;
                    delete settings.retentionExcludePinned;
                    delete settings.retentionFilesOnly;
                    delete settings.retentionIgnoreThreads;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // saving data
            for (var _k = true, _l = __asyncValues(Object.keys(settings)), _m; _m = yield _l.next(), _d = _m.done, !_d; _k = true) {
                _f = _m.value;
                _k = false;
                const setting = _f;
                yield save(setting, {
                    userId,
                    user: user,
                    value: settings[setting],
                    room,
                    rid,
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
            }
            finally { if (e_2) throw e_2.error; }
        }
        void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
        return {
            result: true,
            rid: room._id,
        };
    });
}
meteor_1.Meteor.methods({
    saveRoomSettings: (...args) => {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                function: 'RocketChat.saveRoomName',
            });
        }
        return saveRoomSettings(userId, ...args);
    },
});
