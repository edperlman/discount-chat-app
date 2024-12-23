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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    setAdminStatus(userId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(userId, String);
            (0, check_1.check)(admin, check_1.Match.Optional(Boolean));
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setAdminStatus' });
            }
            if ((yield (0, hasPermission_1.hasPermissionAsync)(uid, 'assign-admin-role')) !== true) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setAdminStatus' });
            }
            const user = yield models_1.Users.findOne({ _id: userId }, { projection: { username: 1, federated: 1 } });
            if (!user || (0, core_typings_1.isUserFederated)(user)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Federated Users cant be admins', { method: 'setAdminStatus' });
            }
            if (admin) {
                return meteor_1.Meteor.callAsync('authorization:addUserToRole', 'admin', user === null || user === void 0 ? void 0 : user.username);
            }
            return meteor_1.Meteor.callAsync('authorization:removeUserFromRole', 'admin', user === null || user === void 0 ? void 0 : user.username);
        });
    },
});
