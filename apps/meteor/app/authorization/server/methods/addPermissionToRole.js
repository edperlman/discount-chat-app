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
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const lib_1 = require("../../lib");
const hasPermission_1 = require("../functions/hasPermission");
meteor_1.Meteor.methods({
    'authorization:addPermissionToRole'(permissionId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lib_1.AuthorizationUtils.isPermissionRestrictedForRole(permissionId, role)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Permission is restricted', {
                    method: 'authorization:addPermissionToRole',
                    action: 'Adding_permission',
                });
            }
            const uid = meteor_1.Meteor.userId();
            const permission = yield models_1.Permissions.findOneById(permissionId);
            if (!permission) {
                throw new meteor_1.Meteor.Error('error-invalid-permission', 'Permission does not exist', {
                    method: 'authorization:addPermissionToRole',
                    action: 'Adding_permission',
                });
            }
            if (!uid ||
                !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'access-permissions')) ||
                (permission.level === lib_1.CONSTANTS.SETTINGS_LEVEL && !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'access-setting-permissions')))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Adding permission is not allowed', {
                    method: 'authorization:addPermissionToRole',
                    action: 'Adding_permission',
                });
            }
            // for setting-based-permissions, authorize the group access as well
            if (permission.groupPermissionId) {
                yield models_1.Permissions.addRole(permission.groupPermissionId, role);
                void (0, notifyListener_1.notifyOnPermissionChangedById)(permission.groupPermissionId);
            }
            yield models_1.Permissions.addRole(permission._id, role);
            void (0, notifyListener_1.notifyOnPermissionChangedById)(permission._id);
        });
    },
});
