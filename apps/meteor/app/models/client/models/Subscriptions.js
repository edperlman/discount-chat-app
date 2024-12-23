"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
const CachedChatSubscription_1 = require("./CachedChatSubscription");
const isTruthy_1 = require("../../../../lib/isTruthy");
/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
exports.Subscriptions = Object.assign(CachedChatSubscription_1.CachedChatSubscription.collection, {
    isUserInRole: (0, mem_1.default)(function (_uid, roleId, rid) {
        if (!rid) {
            return false;
        }
        const query = {
            rid,
        };
        const subscription = this.findOne(query, { fields: { roles: 1 } });
        return subscription && Array.isArray(subscription.roles) && subscription.roles.includes(roleId);
    }, { maxAge: 1000, cacheKey: JSON.stringify }),
    findUsersInRoles: (0, mem_1.default)(function (roles, scope, options) {
        roles = Array.isArray(roles) ? roles : [roles];
        const query = {
            roles: { $in: roles },
        };
        if (scope) {
            query.rid = scope;
        }
        const subscriptions = this.find(query).fetch();
        const uids = subscriptions
            .map((subscription) => {
            if (typeof subscription.u !== 'undefined' && typeof subscription.u._id !== 'undefined') {
                return subscription.u._id;
            }
            return undefined;
        })
            .filter(isTruthy_1.isTruthy);
        return meteor_1.Meteor.users.find({ _id: { $in: uids } }, options);
    }, { maxAge: 1000, cacheKey: JSON.stringify }),
});
