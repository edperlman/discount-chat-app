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
exports.setAvatarFromServiceWithValidation = void 0;
exports.setUserAvatar = setUserAvatar;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const meteor_1 = require("meteor/meteor");
const checkUrlForSsrf_1 = require("./checkUrlForSsrf");
const system_1 = require("../../../../server/lib/logger/system");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../file/server");
const server_2 = require("../../../file-upload/server");
const server_3 = require("../../../settings/server");
const setAvatarFromServiceWithValidation = (userId, dataURI, contentType, service, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dataURI) {
        throw new meteor_1.Meteor.Error('error-invalid-data', 'Invalid dataURI', {
            method: 'setAvatarFromService',
        });
    }
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'setAvatarFromService',
        });
    }
    if (!server_3.settings.get('Accounts_AllowUserAvatarChange')) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'setAvatarFromService',
        });
    }
    let user;
    if (targetUserId && targetUserId !== userId) {
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-avatar'))) {
            throw new meteor_1.Meteor.Error('error-unauthorized', 'Unauthorized', {
                method: 'setAvatarFromService',
            });
        }
        user = yield models_1.Users.findOneById(targetUserId, { projection: { _id: 1, username: 1 } });
    }
    else {
        user = yield models_1.Users.findOneById(userId, { projection: { _id: 1, username: 1 } });
    }
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-desired-user', 'Invalid desired user', {
            method: 'setAvatarFromService',
        });
    }
    return setUserAvatar(user, dataURI, contentType, service);
});
exports.setAvatarFromServiceWithValidation = setAvatarFromServiceWithValidation;
function setUserAvatar(user, dataURI, contentType, service, etag) {
    return __awaiter(this, void 0, void 0, function* () {
        if (service === 'initials') {
            yield models_1.Users.setAvatarData(user._id, service, null);
            return;
        }
        const { buffer, type } = yield (() => __awaiter(this, void 0, void 0, function* () {
            if (service === 'url' && typeof dataURI === 'string') {
                let response;
                const isSsrfSafe = yield (0, checkUrlForSsrf_1.checkUrlForSsrf)(dataURI);
                if (!isSsrfSafe) {
                    throw new meteor_1.Meteor.Error('error-avatar-invalid-url', `Invalid avatar URL: ${encodeURI(dataURI)}`, {
                        function: 'setUserAvatar',
                        url: dataURI,
                    });
                }
                try {
                    response = yield (0, server_fetch_1.serverFetch)(dataURI, { redirect: 'error' });
                }
                catch (e) {
                    system_1.SystemLogger.info(`Not a valid response, from the avatar url: ${encodeURI(dataURI)}`);
                    throw new meteor_1.Meteor.Error('error-avatar-invalid-url', `Invalid avatar URL: ${encodeURI(dataURI)}`, {
                        function: 'setUserAvatar',
                        url: dataURI,
                    });
                }
                if (response.status !== 200) {
                    if (response.status !== 404) {
                        system_1.SystemLogger.info(`Error while handling the setting of the avatar from a url (${encodeURI(dataURI)}) for ${user.username}`);
                        throw new meteor_1.Meteor.Error('error-avatar-url-handling', `Error while handling avatar setting from a URL (${encodeURI(dataURI)}) for ${user.username}`, { function: 'RocketChat.setUserAvatar', url: dataURI, username: user.username });
                    }
                    system_1.SystemLogger.info(`Not a valid response, ${response.status}, from the avatar url: ${dataURI}`);
                    throw new meteor_1.Meteor.Error('error-avatar-invalid-url', `Invalid avatar URL: ${dataURI}`, {
                        function: 'setUserAvatar',
                        url: dataURI,
                    });
                }
                if (!/image\/.+/.test(response.headers.get('content-type') || '')) {
                    system_1.SystemLogger.info(`Not a valid content-type from the provided url, ${response.headers.get('content-type')}, from the avatar url: ${dataURI}`);
                    throw new meteor_1.Meteor.Error('error-avatar-invalid-url', `Invalid avatar URL: ${dataURI}`, {
                        function: 'setUserAvatar',
                        url: dataURI,
                    });
                }
                return {
                    buffer: Buffer.from(yield response.arrayBuffer()),
                    type: response.headers.get('content-type') || '',
                };
            }
            if (service === 'rest') {
                if (!contentType) {
                    throw new meteor_1.Meteor.Error('error-avatar-invalid-content-type', 'Invalid avatar content type', {
                        function: 'setUserAvatar',
                    });
                }
                return {
                    buffer: typeof dataURI === 'string' ? Buffer.from(dataURI, 'binary') : dataURI,
                    type: contentType,
                };
            }
            const fileData = server_1.RocketChatFile.dataURIParse(dataURI);
            return {
                buffer: Buffer.from(fileData.image, 'base64'),
                type: fileData.contentType,
            };
        }))();
        const fileStore = server_2.FileUpload.getStore('Avatars');
        user.username && (yield fileStore.deleteByName(user.username));
        const file = {
            userId: user._id,
            type,
            size: buffer.length,
        };
        const result = yield fileStore.insert(file, buffer);
        const avatarETag = etag || (result === null || result === void 0 ? void 0 : result.etag) || '';
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (service) {
                yield models_1.Users.setAvatarData(user._id, service, avatarETag);
                void core_services_1.api.broadcast('user.avatarUpdate', {
                    username: user.username,
                    avatarETag,
                });
            }
        }), 500);
    });
}
