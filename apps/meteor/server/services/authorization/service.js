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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const canAccessRoom_1 = require("./canAccessRoom");
const AuthorizationUtils_1 = require("../../../app/authorization/lib/AuthorizationUtils");
require("./canAccessRoomLivechat");
// Register as class
class Authorization extends core_services_1.ServiceClass {
    constructor() {
        super();
        this.name = 'authorization';
        this.getRolesCached = (0, mem_1.default)(this.getRoles.bind(this), {
            maxAge: 1000,
            cacheKey: JSON.stringify,
        });
        this.rolesHasPermissionCached = (0, mem_1.default)(this.rolesHasPermission.bind(this), Object.assign({ cacheKey: JSON.stringify }, (process.env.TEST_MODE === 'true' && { maxAge: 1 })));
        this.getPublicRoles = (0, mem_1.default)(() => __awaiter(this, void 0, void 0, function* () {
            const roles = yield models_1.Roles.find({ scope: 'Users', description: { $exists: true, $ne: '' } }, { projection: { _id: 1 } }).toArray();
            return roles.map(({ _id }) => _id);
        }), { maxAge: 10000 });
        this.getUserFromRoles = (0, mem_1.default)((roleIds) => __awaiter(this, void 0, void 0, function* () {
            const options = {
                sort: {
                    username: 1,
                },
                projection: {
                    username: 1,
                    roles: 1,
                },
            };
            const users = yield models_1.Users.findUsersInRoles(roleIds, null, options).toArray();
            return users.map((user) => (Object.assign(Object.assign({}, user), { roles: user.roles.filter((roleId) => roleIds.includes(roleId)) })));
        }), { maxAge: 10000 });
        const clearCache = () => {
            mem_1.default.clear(this.getRolesCached);
            mem_1.default.clear(this.rolesHasPermissionCached);
        };
        this.onEvent('watch.roles', clearCache);
        this.onEvent('permission.changed', clearCache);
        this.onEvent('authorization.guestPermissions', (permissions) => {
            AuthorizationUtils_1.AuthorizationUtils.addRolePermissionWhiteList('guest', permissions);
        });
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(yield core_services_1.License.hasValidLicense())) {
                    return;
                }
                const permissions = yield core_services_1.License.getGuestPermissions();
                if (!permissions) {
                    return;
                }
                AuthorizationUtils_1.AuthorizationUtils.addRolePermissionWhiteList('guest', permissions);
            }
            catch (error) {
                console.error('Authorization Service did not start correctly', error);
            }
        });
    }
    hasAllPermission(userId, permissions, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return false;
            }
            return this.all(userId, permissions, scope);
        });
    }
    hasPermission(userId, permissionId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return false;
            }
            return this.all(userId, [permissionId], scope);
        });
    }
    hasAtLeastOnePermission(userId, permissions, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return false;
            }
            return this.atLeastOne(userId, permissions, scope);
        });
    }
    canAccessRoom(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, canAccessRoom_1.canAccessRoom)(...args);
        });
    }
    canAccessRoomId(rid, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(rid, {
                projection: {
                    _id: 1,
                    t: 1,
                    teamId: 1,
                    prid: 1,
                },
            });
            if (!room) {
                return false;
            }
            return this.canAccessRoom(room, { _id: uid });
        });
    }
    addRoleRestrictions(role, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            AuthorizationUtils_1.AuthorizationUtils.addRolePermissionWhiteList(role, permissions);
        });
    }
    getUsersFromPublicRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const roleIds = yield this.getPublicRoles();
            return this.getUserFromRoles(roleIds);
        });
    }
    rolesHasPermission(permission, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AuthorizationUtils_1.AuthorizationUtils.isPermissionRestrictedForRoleList(permission, roles)) {
                return false;
            }
            const result = yield models_1.Permissions.findOne({ _id: permission, roles: { $in: roles } }, { projection: { _id: 1 } });
            return !!result;
        });
    }
    getRoles(uid, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roles: userRoles = [] } = (yield models_1.Users.findOneById(uid, { projection: { roles: 1 } })) || {};
            const { roles: subscriptionsRoles = [] } = (scope &&
                (yield models_1.Subscriptions.findOne({ 'rid': scope, 'u._id': uid }, { projection: { roles: 1 } }))) ||
                {};
            return [...userRoles, ...subscriptionsRoles].sort((a, b) => a.localeCompare(b));
        });
    }
    atLeastOne(uid_1) {
        return __awaiter(this, arguments, void 0, function* (uid, permissions = [], scope) {
            var _a, permissions_1, permissions_1_1;
            var _b, e_1, _c, _d;
            const sortedRoles = yield this.getRolesCached(uid, scope);
            try {
                for (_a = true, permissions_1 = __asyncValues(permissions); permissions_1_1 = yield permissions_1.next(), _b = permissions_1_1.done, !_b; _a = true) {
                    _d = permissions_1_1.value;
                    _a = false;
                    const permission = _d;
                    if (yield this.rolesHasPermissionCached(permission, sortedRoles)) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = permissions_1.return)) yield _c.call(permissions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        });
    }
    all(uid_1) {
        return __awaiter(this, arguments, void 0, function* (uid, permissions = [], scope) {
            var _a, permissions_2, permissions_2_1;
            var _b, e_2, _c, _d;
            const sortedRoles = yield this.getRolesCached(uid, scope);
            try {
                for (_a = true, permissions_2 = __asyncValues(permissions); permissions_2_1 = yield permissions_2.next(), _b = permissions_2_1.done, !_b; _a = true) {
                    _d = permissions_2_1.value;
                    _a = false;
                    const permission = _d;
                    if (!(yield this.rolesHasPermissionCached(permission, sortedRoles))) {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = permissions_2.return)) yield _c.call(permissions_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        });
    }
}
exports.Authorization = Authorization;
