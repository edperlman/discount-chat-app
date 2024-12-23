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
exports.RolesRaw = void 0;
const models_1 = require("@rocket.chat/models");
const BaseRaw_1 = require("./BaseRaw");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
class RolesRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'roles', trash);
    }
    findByUpdatedDate(updatedAfterDate, options) {
        const query = {
            _updatedAt: { $gte: new Date(updatedAfterDate) },
        };
        return options ? this.find(query, options) : this.find(query);
    }
    addUserRoles(userId, roles, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, roles_1, roles_1_1;
            var _b, e_1, _c, _d;
            if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
                throw new Error('Roles.addUserRoles method received a role scope instead of a scope value.');
            }
            if (!Array.isArray(roles)) {
                roles = [roles];
                process.env.NODE_ENV === 'development' && console.warn('[WARN] RolesRaw.addUserRoles: roles should be an array');
            }
            try {
                for (_a = true, roles_1 = __asyncValues(roles); roles_1_1 = yield roles_1.next(), _b = roles_1_1.done, !_b; _a = true) {
                    _d = roles_1_1.value;
                    _a = false;
                    const roleId = _d;
                    const role = yield this.findOneById(roleId, { projection: { scope: 1 } });
                    if (!role) {
                        process.env.NODE_ENV === 'development' && console.warn(`[WARN] RolesRaw.addUserRoles: role: ${roleId} not found`);
                        continue;
                    }
                    if (role.scope === 'Subscriptions' && scope) {
                        // TODO remove dependency from other models - this logic should be inside a function/service
                        const addRolesResponse = yield models_1.Subscriptions.addRolesByUserId(userId, [role._id], scope);
                        if (addRolesResponse.modifiedCount) {
                            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(scope, userId);
                        }
                    }
                    else {
                        yield models_1.Users.addRolesByUserId(userId, [role._id]);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = roles_1.return)) yield _c.call(roles_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        });
    }
    isUserInRoles(userId, roles, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, roles_2, roles_2_1;
            var _b, e_2, _c, _d;
            if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
                throw new Error('Roles.isUserInRoles method received a role scope instead of a scope value.');
            }
            try {
                for (_a = true, roles_2 = __asyncValues(roles); roles_2_1 = yield roles_2.next(), _b = roles_2_1.done, !_b; _a = true) {
                    _d = roles_2_1.value;
                    _a = false;
                    const roleId = _d;
                    const role = yield this.findOneById(roleId, { projection: { scope: 1 } });
                    if (!role) {
                        continue;
                    }
                    switch (role.scope) {
                        case 'Subscriptions':
                            if (yield models_1.Subscriptions.isUserInRole(userId, roleId, scope)) {
                                return true;
                            }
                            break;
                        case 'Users':
                        default:
                            if (yield models_1.Users.isUserInRole(userId, roleId)) {
                                return true;
                            }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = roles_2.return)) yield _c.call(roles_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return false;
        });
    }
    removeUserRoles(userId, roles, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, roles_3, roles_3_1;
            var _b, e_3, _c, _d;
            if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
                throw new Error('Roles.removeUserRoles method received a role scope instead of a scope value.');
            }
            try {
                for (_a = true, roles_3 = __asyncValues(roles); roles_3_1 = yield roles_3.next(), _b = roles_3_1.done, !_b; _a = true) {
                    _d = roles_3_1.value;
                    _a = false;
                    const roleId = _d;
                    const role = yield this.findOneById(roleId, { projection: { scope: 1 } });
                    if (!role) {
                        continue;
                    }
                    if (role.scope === 'Subscriptions' && scope) {
                        const removeRolesResponse = yield models_1.Subscriptions.removeRolesByUserId(userId, [roleId], scope);
                        if (removeRolesResponse.modifiedCount) {
                            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(scope, userId);
                        }
                    }
                    else {
                        yield models_1.Users.removeRolesByUserId(userId, [roleId]);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = roles_3.return)) yield _c.call(roles_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return true;
        });
    }
    findOneByIdOrName(_idOrName, options) {
        const query = {
            $or: [
                {
                    _id: _idOrName,
                },
                {
                    name: _idOrName,
                },
            ],
        };
        return this.findOne(query, options);
    }
    findOneByName(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                name,
            };
            return this.findOne(query, options);
        });
    }
    findInIds(ids, options) {
        const query = {
            _id: {
                $in: ids,
            },
        };
        return this.find(query, options || {});
    }
    findInIdsOrNames(_idsOrNames, options) {
        const query = {
            $or: [
                {
                    _id: {
                        $in: _idsOrNames,
                    },
                },
                {
                    name: {
                        $in: _idsOrNames,
                    },
                },
            ],
        };
        return this.find(query, options || {});
    }
    findAllExceptIds(ids, options) {
        const query = {
            _id: {
                $nin: ids,
            },
        };
        return this.find(query, options || {});
    }
    findByScope(scope, options) {
        const query = {
            scope,
        };
        return this.find(query, options || {});
    }
    countByScope(scope, options) {
        const query = {
            scope,
        };
        return this.countDocuments(query, options);
    }
    findCustomRoles(options) {
        const query = {
            protected: false,
        };
        return this.find(query, options || {});
    }
    countCustomRoles(options) {
        const query = {
            protected: false,
        };
        return this.countDocuments(query, options || {});
    }
    updateById(_id_1, name_1, scope_1) {
        return __awaiter(this, arguments, void 0, function* (_id, name, scope, description = '', mandatory2fa = false) {
            const response = yield this.findOneAndUpdate({ _id }, {
                $set: {
                    name,
                    scope,
                    description,
                    mandatory2fa,
                },
            }, { upsert: true, returnDocument: 'after' });
            if (!response.value) {
                throw new Error('Role not found');
            }
            return response.value;
        });
    }
    /** @deprecated function getUsersInRole should be used instead */
    findUsersInRole(roleId, scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
                throw new Error('Roles.findUsersInRole method received a role scope instead of a scope value.');
            }
            const role = yield this.findOneById(roleId, { projection: { scope: 1 } });
            if (!role) {
                throw new Error('RolesRaw.findUsersInRole: role not found');
            }
            switch (role.scope) {
                case 'Subscriptions':
                    return models_1.Subscriptions.findUsersInRoles([role._id], scope, options);
                case 'Users':
                default:
                    return models_1.Users.findUsersInRoles([role._id], null, options);
            }
        });
    }
    countUsersInRole(roleId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.findOneById(roleId, { projection: { scope: 1 } });
            if (!role) {
                throw new Error('RolesRaw.countUsersInRole: role not found');
            }
            switch (role.scope) {
                case 'Subscriptions':
                    return models_1.Subscriptions.countUsersInRoles([role._id], scope);
                case 'Users':
                default:
                    return models_1.Users.countUsersInRoles([role._id]);
            }
        });
    }
    createWithRandomId(name_1) {
        return __awaiter(this, arguments, void 0, function* (name, scope = 'Users', description = '', protectedRole = true, mandatory2fa = false) {
            const role = {
                name,
                scope,
                description,
                protected: protectedRole,
                mandatory2fa,
            };
            const res = yield this.insertOne(role);
            return Object.assign({ _id: res.insertedId }, role);
        });
    }
    canAddUserToRole(uid, roleId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
                throw new Error('Roles.canAddUserToRole method received a role scope instead of a scope value.');
            }
            const role = yield this.findOne({ _id: roleId }, { projection: { scope: 1 } });
            if (!role) {
                return false;
            }
            switch (role.scope) {
                case 'Subscriptions':
                    return models_1.Subscriptions.isUserInRoleScope(uid, scope);
                case 'Users':
                default:
                    return models_1.Users.isUserInRoleScope(uid);
            }
        });
    }
}
exports.RolesRaw = RolesRaw;
