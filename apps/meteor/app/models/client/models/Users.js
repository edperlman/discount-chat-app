"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
class UsersCollection extends mongo_1.Mongo.Collection {
    constructor() {
        super(null);
    }
    findOneById(uid, options) {
        const query = {
            _id: uid,
        };
        return this.findOne(query, options);
    }
    isUserInRole(uid, roleId) {
        const user = this.findOneById(uid, { fields: { roles: 1 } });
        return user && Array.isArray(user.roles) && user.roles.includes(roleId);
    }
    findUsersInRoles(roles, _scope, options) {
        roles = Array.isArray(roles) ? roles : [roles];
        const query = {
            roles: { $in: roles },
        };
        return this.find(query, options);
    }
}
Object.assign(meteor_1.Meteor.users, {
    _connection: undefined,
    findOneById: UsersCollection.prototype.findOneById,
    isUserInRole: UsersCollection.prototype.isUserInRole,
    findUsersInRoles: UsersCollection.prototype.findUsersInRoles,
    remove: UsersCollection.prototype.remove,
});
/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
exports.Users = meteor_1.Meteor.users;
