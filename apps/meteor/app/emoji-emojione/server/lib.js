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
const server_1 = require("../../emoji/server");
const getUserPreference_1 = require("../../utils/server/lib/getUserPreference");
const getEmojiConfig_1 = require("../lib/getEmojiConfig");
const isSetNotNull_1 = require("../lib/isSetNotNull");
const config = (0, getEmojiConfig_1.getEmojiConfig)();
server_1.emoji.packages.emojione = config.emojione;
if (server_1.emoji.packages.emojione) {
    server_1.emoji.packages.emojione.sprites = config.sprites;
    server_1.emoji.packages.emojione.emojisByCategory = config.emojisByCategory;
    server_1.emoji.packages.emojione.emojiCategories = config.emojiCategories;
    server_1.emoji.packages.emojione.toneList = config.toneList;
    server_1.emoji.packages.emojione.render = config.render;
    server_1.emoji.packages.emojione.renderPicker = config.renderPicker;
    // TODO: check types
    // RocketChat.emoji.list is the collection of emojis from all emoji packages
    for (const key in config.emojione.emojioneList) {
        if (config.emojione.emojioneList.hasOwnProperty(key)) {
            const currentEmoji = config.emojione.emojioneList[key];
            currentEmoji.emojiPackage = 'emojione';
            server_1.emoji.list[key] = currentEmoji;
            if (currentEmoji.shortnames) {
                currentEmoji.shortnames.forEach((shortname) => {
                    server_1.emoji.list[shortname] = currentEmoji;
                });
            }
        }
    }
    // Additional settings -- ascii emojis
    meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
        if ((yield (0, isSetNotNull_1.isSetNotNull)(() => server_1.emoji.packages.emojione)) && server_1.emoji.packages.emojione) {
            if (yield (0, isSetNotNull_1.isSetNotNull)(() => (0, getUserPreference_1.getUserPreference)(meteor_1.Meteor.userId(), 'convertAsciiEmoji'))) {
                server_1.emoji.packages.emojione.ascii = yield (0, getUserPreference_1.getUserPreference)(meteor_1.Meteor.userId(), 'convertAsciiEmoji');
            }
            else {
                server_1.emoji.packages.emojione.ascii = true;
            }
        }
    }));
}
