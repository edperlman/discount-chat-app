"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const mongo_1 = require("meteor/mongo");
const reactive_var_1 = require("meteor/reactive-var");
const Subscriptions_1 = require("./Subscriptions");
const Users_1 = require("./Users");
class RolesCollection extends mongo_1.Mongo.Collection {
    constructor() {
        super(null);
        this.ready = new reactive_var_1.ReactiveVar(false);
    }
    isUserInRoles(userId, roles, scope, ignoreSubscriptions = false) {
        roles = Array.isArray(roles) ? roles : [roles];
        return roles.some((roleId) => {
            const role = this.findOne(roleId);
            const roleScope = ignoreSubscriptions ? 'Users' : (role === null || role === void 0 ? void 0 : role.scope) || 'Users';
            switch (roleScope) {
                case 'Subscriptions':
                    return Subscriptions_1.Subscriptions.isUserInRole(userId, roleId, scope);
                case 'Users':
                    return Users_1.Users.isUserInRole(userId, roleId);
                default:
                    return false;
            }
        });
    }
}
/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
exports.Roles = new RolesCollection();
