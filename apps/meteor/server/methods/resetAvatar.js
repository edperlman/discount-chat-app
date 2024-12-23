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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../app/file-upload/server");
const server_2 = require("../../app/settings/server");
meteor_1.Meteor.methods({
    resetAvatar(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'resetAvatar',
                });
            }
            const canEditOtherUserAvatar = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-other-user-avatar');
            if (!server_2.settings.get('Accounts_AllowUserAvatarChange') && !canEditOtherUserAvatar) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'resetAvatar',
                });
            }
            let user;
            if (userId && userId !== uid) {
                if (!canEditOtherUserAvatar) {
                    throw new meteor_1.Meteor.Error('error-unauthorized', 'Unauthorized', {
                        method: 'resetAvatar',
                    });
                }
                user = yield models_1.Users.findOneById(userId, { projection: { _id: 1, username: 1 } });
            }
            else {
                user = yield meteor_1.Meteor.userAsync();
            }
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-desired-user', 'Invalid desired user', {
                    method: 'resetAvatar',
                });
            }
            yield server_1.FileUpload.getStore('Avatars').deleteByName(user.username);
            yield models_1.Users.unsetAvatarData(user._id);
            void core_services_1.api.broadcast('user.avatarUpdate', { username: user.username, avatarETag: undefined });
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'resetAvatar',
    userId() {
        return true;
    },
}, 1, 60000);
