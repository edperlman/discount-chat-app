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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const setUserActiveStatus_1 = require("../../app/lib/server/functions/setUserActiveStatus");
meteor_1.Meteor.methods({
    setUserActiveStatus(userId, active, confirmRelinquish) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(userId, String);
            (0, check_1.check)(active, Boolean);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'setUserActiveStatus',
                });
            }
            const uid = meteor_1.Meteor.userId();
            if (!uid || (yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-other-user-active-status')) !== true) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'setUserActiveStatus',
                });
            }
            yield (0, setUserActiveStatus_1.setUserActiveStatus)(userId, active, confirmRelinquish);
            return true;
        });
    },
});
