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
const meteor_1 = require("meteor/meteor");
const refreshLoginServices_1 = require("../../../../server/lib/refreshLoginServices");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    refreshOAuthService() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'refreshOAuthService',
                });
            }
            if ((yield (0, hasPermission_1.hasPermissionAsync)(userId, 'add-oauth-service')) !== true) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Refresh OAuth Services is not allowed', {
                    method: 'refreshOAuthService',
                    action: 'Refreshing_OAuth_Services',
                });
            }
            yield (0, refreshLoginServices_1.refreshLoginServices)();
        });
    },
});
