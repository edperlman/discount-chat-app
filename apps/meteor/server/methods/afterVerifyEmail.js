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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const rolesToChangeTo = new Map([['anonymous', ['user']]]);
meteor_1.Meteor.methods({
    afterVerifyEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'afterVerifyEmail',
                });
            }
            const user = yield models_1.Users.findOneById(userId);
            if ((user === null || user === void 0 ? void 0 : user.emails) && Array.isArray(user.emails)) {
                const verifiedEmail = user.emails.find((email) => email.verified);
                const rolesThatNeedChanges = user.roles.filter((role) => rolesToChangeTo.has(role));
                if (verifiedEmail) {
                    yield Promise.all(rolesThatNeedChanges.map((role) => __awaiter(this, void 0, void 0, function* () {
                        const rolesToAdd = rolesToChangeTo.get(role);
                        if (rolesToAdd) {
                            yield models_1.Roles.addUserRoles(userId, rolesToAdd);
                        }
                        yield models_1.Roles.removeUserRoles(user._id, [role]);
                    })));
                }
            }
        });
    },
});
