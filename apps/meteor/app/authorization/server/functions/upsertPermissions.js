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
exports.upsertPermissions = void 0;
const models_1 = require("@rocket.chat/models");
const createOrUpdateProtectedRole_1 = require("../../../../server/lib/roles/createOrUpdateProtectedRole");
const server_1 = require("../../../settings/server");
const lib_1 = require("../../lib");
const permissions_1 = require("../constant/permissions");
const upsertPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    try {
        for (var _g = true, permissions_2 = __asyncValues(permissions_1.permissions), permissions_2_1; permissions_2_1 = yield permissions_2.next(), _a = permissions_2_1.done, !_a; _g = true) {
            _c = permissions_2_1.value;
            _g = false;
            const permission = _c;
            yield models_1.Permissions.create(permission._id, permission.roles);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = permissions_2.return)) yield _b.call(permissions_2);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const defaultRoles = [
        { name: 'admin', scope: 'Users', description: 'Admin' },
        { name: 'moderator', scope: 'Subscriptions', description: 'Moderator' },
        { name: 'leader', scope: 'Subscriptions', description: 'Leader' },
        { name: 'owner', scope: 'Subscriptions', description: 'Owner' },
        { name: 'user', scope: 'Users', description: '' },
        { name: 'bot', scope: 'Users', description: '' },
        { name: 'app', scope: 'Users', description: '' },
        { name: 'guest', scope: 'Users', description: '' },
        { name: 'anonymous', scope: 'Users', description: '' },
        { name: 'livechat-agent', scope: 'Users', description: 'Livechat Agent' },
        { name: 'livechat-manager', scope: 'Users', description: 'Livechat Manager' },
    ];
    try {
        for (var _h = true, defaultRoles_1 = __asyncValues(defaultRoles), defaultRoles_1_1; defaultRoles_1_1 = yield defaultRoles_1.next(), _d = defaultRoles_1_1.done, !_d; _h = true) {
            _f = defaultRoles_1_1.value;
            _h = false;
            const role = _f;
            yield (0, createOrUpdateProtectedRole_1.createOrUpdateProtectedRoleAsync)(role.name, role);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_h && !_d && (_e = defaultRoles_1.return)) yield _e.call(defaultRoles_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    const getPreviousPermissions = function (settingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const previousSettingPermissions = {};
            yield models_1.Permissions.findByLevel('settings', settingId).forEach((permission) => {
                previousSettingPermissions[permission._id] = permission;
            });
            return previousSettingPermissions;
        });
    };
    const createSettingPermission = function (setting, previousSettingPermissions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const permissionId = (0, lib_1.getSettingPermissionId)(setting._id);
            const permission = {
                level: lib_1.CONSTANTS.SETTINGS_LEVEL,
                // copy those setting-properties which are needed to properly publish the setting-based permissions
                settingId: setting._id,
                group: setting.group,
                section: (_a = setting.section) !== null && _a !== void 0 ? _a : undefined,
                sorter: setting.sorter,
                roles: [],
            };
            // copy previously assigned roles if available
            if ((_b = previousSettingPermissions[permissionId]) === null || _b === void 0 ? void 0 : _b.roles) {
                permission.roles = previousSettingPermissions[permissionId].roles;
            }
            if (setting.group) {
                permission.groupPermissionId = (0, lib_1.getSettingPermissionId)(setting.group);
            }
            if (setting.section) {
                permission.sectionPermissionId = (0, lib_1.getSettingPermissionId)(setting.section);
            }
            const existent = yield models_1.Permissions.findOne(Object.assign({ _id: permissionId }, permission), { projection: { _id: 1 } });
            if (!existent) {
                try {
                    yield models_1.Permissions.updateOne({ _id: permissionId }, { $set: permission }, { upsert: true });
                }
                catch (e) {
                    if (!e.message.includes('E11000')) {
                        // E11000 refers to a MongoDB error that can occur when using unique indexes for upserts
                        // https://docs.mongodb.com/manual/reference/method/db.collection.update/#use-unique-indexes
                        yield models_1.Permissions.updateOne({ _id: permissionId }, { $set: permission }, { upsert: true });
                    }
                }
            }
            delete previousSettingPermissions[permissionId];
        });
    };
    const createPermissionsForExistingSettings = function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c, _d, e_4, _e, _f;
            const previousSettingPermissions = yield getPreviousPermissions();
            const settings = yield models_1.Settings.findNotHidden().toArray();
            try {
                for (var _g = true, settings_1 = __asyncValues(settings), settings_1_1; settings_1_1 = yield settings_1.next(), _a = settings_1_1.done, !_a; _g = true) {
                    _c = settings_1_1.value;
                    _g = false;
                    const setting = _c;
                    yield createSettingPermission(setting, previousSettingPermissions);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = settings_1.return)) yield _b.call(settings_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                // remove permissions for non-existent settings
                for (var _h = true, _j = __asyncValues(Object.keys(previousSettingPermissions)), _k; _k = yield _j.next(), _d = _k.done, !_d; _h = true) {
                    _f = _k.value;
                    _h = false;
                    const obsoletePermission = _f;
                    if (previousSettingPermissions.hasOwnProperty(obsoletePermission)) {
                        yield models_1.Permissions.deleteOne({ _id: obsoletePermission });
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = _j.return)) yield _e.call(_j);
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
    };
    // for each setting which already exists, create a permission to allow changing just this one setting
    yield createPermissionsForExistingSettings();
    // register a callback for settings for be create in higher-level-packages
    server_1.settings.on('*', (_a) => __awaiter(void 0, [_a], void 0, function* ([settingId]) {
        const previousSettingPermissions = yield getPreviousPermissions(settingId);
        const setting = yield models_1.Settings.findOneById(settingId);
        if (setting && !setting.hidden) {
            yield createSettingPermission(setting, previousSettingPermissions);
        }
    }));
});
exports.upsertPermissions = upsertPermissions;
