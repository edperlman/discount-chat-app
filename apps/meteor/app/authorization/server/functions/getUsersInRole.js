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
exports.getUsersInRole = getUsersInRole;
exports.getUsersInRolePaginated = getUsersInRolePaginated;
const models_1 = require("@rocket.chat/models");
const lodash_1 = require("lodash");
function getUsersInRole(roleId, scope, options) {
    // TODO move the code from Roles.findUsersInRole to here and change all places to use this function
    return models_1.Roles.findUsersInRole(roleId, scope, options);
}
function getUsersInRolePaginated(roleId, scope, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'development' && (scope === 'Users' || scope === 'Subscriptions')) {
            throw new Error('Roles.findUsersInRole method received a role scope instead of a scope value.');
        }
        const role = yield models_1.Roles.findOneById(roleId, { projection: { scope: 1 } });
        if (!role) {
            throw new Error('role not found');
        }
        switch (role.scope) {
            case 'Subscriptions':
                const subscriptions = yield models_1.Subscriptions.findByRolesAndRoomId({ roles: role._id, rid: scope }, { projection: { 'u._id': 1 } })
                    .map((subscription) => { var _a; return (_a = subscription.u) === null || _a === void 0 ? void 0 : _a._id; })
                    .toArray();
                return models_1.Users.findPaginated({ _id: { $in: (0, lodash_1.compact)(subscriptions) } }, options || {});
            case 'Users':
            default:
                return models_1.Users.findPaginatedUsersInRoles([role._id], options);
        }
    });
}
