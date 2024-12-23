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
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const emoji_custom_1 = require("../startup/emoji-custom");
meteor_1.Meteor.methods({
    deleteEmojiCustom(emojiID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId || !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-emoji'))) {
                throw new meteor_1.Meteor.Error('not_authorized');
            }
            const emoji = yield models_1.EmojiCustom.findOneById(emojiID);
            if (emoji == null) {
                throw new meteor_1.Meteor.Error('Custom_Emoji_Error_Invalid_Emoji', 'Invalid emoji', {
                    method: 'deleteEmojiCustom',
                });
            }
            yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emoji.name}.${emoji.extension}`));
            yield models_1.EmojiCustom.removeById(emojiID);
            void core_services_1.api.broadcast('emoji.deleteCustom', emoji);
            return true;
        });
    },
});
