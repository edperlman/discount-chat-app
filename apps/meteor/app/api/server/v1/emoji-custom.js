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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const system_1 = require("../../../../server/lib/logger/system");
const insertOrUpdateEmoji_1 = require("../../../emoji-custom/server/lib/insertOrUpdateEmoji");
const uploadEmojiCustom_1 = require("../../../emoji-custom/server/lib/uploadEmojiCustom");
const server_1 = require("../../../settings/server");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const emoji_custom_1 = require("../lib/emoji-custom");
const getUploadFormData_1 = require("../lib/getUploadFormData");
function validateDateParam(paramName, paramValue) {
    if (!paramValue) {
        return undefined;
    }
    const date = new Date(paramValue);
    if (isNaN(date.getTime())) {
        throw new meteor_1.Meteor.Error('error-roomId-param-invalid', `The "${paramName}" query parameter must be a valid date.`);
    }
    return date;
}
api_1.API.v1.addRoute('emoji-custom.list', { authRequired: true, validateParams: rest_typings_1.isEmojiCustomList }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = yield this.parseJsonQuery();
            const { updatedSince, _updatedAt, _id } = this.queryParams;
            const updatedSinceDate = validateDateParam('updatedSince', updatedSince);
            const _updatedAtDate = validateDateParam('_updatedAt', _updatedAt);
            if (updatedSinceDate) {
                const [update, remove] = yield Promise.all([
                    models_1.EmojiCustom.find(Object.assign(Object.assign(Object.assign(Object.assign({}, query), (_id ? { _id } : {})), (_updatedAtDate ? { _updatedAt: { $gt: _updatedAtDate } } : {})), { _updatedAt: { $gt: updatedSinceDate } })).toArray(),
                    models_1.EmojiCustom.trashFindDeletedAfter(updatedSinceDate).toArray(),
                ]);
                return api_1.API.v1.success({
                    emojis: {
                        update,
                        remove,
                    },
                });
            }
            return api_1.API.v1.success({
                emojis: {
                    update: yield models_1.EmojiCustom.find(Object.assign(Object.assign(Object.assign({}, query), (_id ? { _id } : {})), (_updatedAtDate ? { _updatedAt: { $gt: _updatedAtDate } } : {}))).toArray(),
                    remove: [],
                },
            });
        });
    },
});
api_1.API.v1.addRoute('emoji-custom.all', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            return api_1.API.v1.success(yield (0, emoji_custom_1.findEmojisCustom)({
                query,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
api_1.API.v1.addRoute('emoji-custom.create', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const emoji = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'emoji', sizeLimit: server_1.settings.get('FileUpload_MaxFileSize') });
            const { fields, fileBuffer, mimetype } = emoji;
            const isUploadable = yield core_services_1.Media.isImage(fileBuffer);
            if (!isUploadable) {
                throw new meteor_1.Meteor.Error('emoji-is-not-image', "Emoji file provided cannot be uploaded since it's not an image");
            }
            const [, extension] = mimetype.split('/');
            fields.extension = extension;
            try {
                const emojiData = yield (0, insertOrUpdateEmoji_1.insertOrUpdateEmoji)(this.userId, Object.assign(Object.assign({}, fields), { newFile: true, aliases: fields.aliases || '', name: fields.name, extension: fields.extension }));
                yield (0, uploadEmojiCustom_1.uploadEmojiCustomWithBuffer)(this.userId, fileBuffer, mimetype, emojiData);
            }
            catch (e) {
                system_1.SystemLogger.error(e);
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('emoji-custom.update', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const emoji = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'emoji', sizeLimit: server_1.settings.get('FileUpload_MaxFileSize'), fileOptional: true });
            const { fields, fileBuffer, mimetype } = emoji;
            if (!fields._id) {
                throw new meteor_1.Meteor.Error('The required "_id" query param is missing.');
            }
            const emojiToUpdate = yield models_1.EmojiCustom.findOneById(fields._id, {
                projection: { name: 1, extension: 1 },
            });
            if (!emojiToUpdate) {
                throw new meteor_1.Meteor.Error('Emoji not found.');
            }
            const emojiData = {
                previousName: emojiToUpdate.name,
                previousExtension: emojiToUpdate.extension,
                aliases: fields.aliases || '',
                name: fields.name,
                extension: fields.extension,
                _id: fields._id,
                newFile: false,
            };
            const isNewFile = (fileBuffer === null || fileBuffer === void 0 ? void 0 : fileBuffer.length) && !!mimetype;
            if (isNewFile) {
                emojiData.newFile = isNewFile;
                const isUploadable = yield core_services_1.Media.isImage(fileBuffer);
                if (!isUploadable) {
                    throw new meteor_1.Meteor.Error('emoji-is-not-image', "Emoji file provided cannot be uploaded since it's not an image");
                }
                const [, extension] = mimetype.split('/');
                emojiData.extension = extension;
            }
            else {
                emojiData.extension = emojiToUpdate.extension;
            }
            const updatedEmojiData = yield (0, insertOrUpdateEmoji_1.insertOrUpdateEmoji)(this.userId, emojiData);
            if (isNewFile) {
                yield (0, uploadEmojiCustom_1.uploadEmojiCustomWithBuffer)(this.userId, fileBuffer, mimetype, updatedEmojiData);
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('emoji-custom.delete', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { emojiId } = this.bodyParams;
            if (!emojiId) {
                return api_1.API.v1.failure('The "emojiId" params is required!');
            }
            yield meteor_1.Meteor.callAsync('deleteEmojiCustom', emojiId);
            return api_1.API.v1.success();
        });
    },
});
