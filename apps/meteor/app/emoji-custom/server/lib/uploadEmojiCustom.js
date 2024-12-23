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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEmojiCustom = uploadEmojiCustom;
exports.uploadEmojiCustomWithBuffer = uploadEmojiCustomWithBuffer;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const limax_1 = __importDefault(require("limax"));
const meteor_1 = require("meteor/meteor");
const sharp_1 = __importDefault(require("sharp"));
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../file/server");
const emoji_custom_1 = require("../startup/emoji-custom");
const getFile = (file, extension) => __awaiter(void 0, void 0, void 0, function* () {
    if (extension !== 'svg+xml') {
        return file;
    }
    return (0, sharp_1.default)(file).png().toBuffer();
});
function uploadEmojiCustom(userId, binaryContent, contentType, emojiData) {
    return __awaiter(this, void 0, void 0, function* () {
        return uploadEmojiCustomWithBuffer(userId, Buffer.from(binaryContent, 'binary'), contentType, emojiData);
    });
}
function uploadEmojiCustomWithBuffer(userId, buffer, contentType, emojiData) {
    return __awaiter(this, void 0, void 0, function* () {
        // technically, since this method doesnt have any datatype validations, users can
        // upload videos as emojis. The FE won't play them, but they will waste space for sure.
        if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-emoji'))) {
            throw new meteor_1.Meteor.Error('not_authorized');
        }
        if (!Array.isArray(emojiData.aliases)) {
            // delete aliases for notification purposes. here, it is a string or undefined rather than an array
            delete emojiData.aliases;
        }
        emojiData.name = (0, limax_1.default)(emojiData.name, { replacement: '_' });
        const file = yield getFile(buffer, emojiData.extension);
        emojiData.extension = emojiData.extension === 'svg+xml' ? 'png' : emojiData.extension;
        let fileBuffer;
        // sharp doesn't support these formats without imagemagick or libvips installed
        // so they will be stored as they are :(
        if (['gif', 'x-icon', 'bmp', 'webm'].includes(emojiData.extension)) {
            fileBuffer = file;
        }
        else {
            // This is to support the idea of having "sticker-like" emojis
            const { data: resizedEmojiBuffer } = yield core_services_1.Media.resizeFromBuffer(file, 512, 512, true, false, false, 'inside');
            fileBuffer = resizedEmojiBuffer;
        }
        const rs = server_1.RocketChatFile.bufferToStream(fileBuffer);
        yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.name}.${emojiData.extension}`));
        return new Promise((resolve) => {
            const ws = emoji_custom_1.RocketChatFileEmojiCustomInstance.createWriteStream(encodeURIComponent(`${emojiData.name}.${emojiData.extension}`), contentType);
            ws.on('end', () => __awaiter(this, void 0, void 0, function* () {
                const etag = random_1.Random.hexString(6);
                yield models_1.EmojiCustom.setETagByName(emojiData.name, etag);
                setTimeout(() => core_services_1.api.broadcast('emoji.updateCustom', Object.assign(Object.assign({}, emojiData), { etag })), 500);
                resolve();
            }));
            rs.pipe(ws);
        });
    });
}
