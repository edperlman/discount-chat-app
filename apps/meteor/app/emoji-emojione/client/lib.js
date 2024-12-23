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
const client_1 = require("../../emoji/client");
const client_2 = require("../../utils/client");
const getEmojiConfig_1 = require("../lib/getEmojiConfig");
const isSetNotNull_1 = require("../lib/isSetNotNull");
const config = (0, getEmojiConfig_1.getEmojiConfig)();
client_1.emoji.packages.emojione = config.emojione;
if (client_1.emoji.packages.emojione) {
    client_1.emoji.packages.emojione.sprites = config.sprites;
    client_1.emoji.packages.emojione.emojisByCategory = config.emojisByCategory;
    client_1.emoji.packages.emojione.emojiCategories = config.emojiCategories;
    client_1.emoji.packages.emojione.toneList = config.toneList;
    client_1.emoji.packages.emojione.render = config.render;
    client_1.emoji.packages.emojione.renderPicker = config.renderPicker;
    // RocketChat.emoji.list is the collection of emojis from all emoji packages
    for (const [key, currentEmoji] of Object.entries(config.emojione.emojioneList)) {
        currentEmoji.emojiPackage = 'emojione';
        client_1.emoji.list[key] = currentEmoji;
        if (currentEmoji.shortnames) {
            currentEmoji.shortnames.forEach((shortname) => {
                client_1.emoji.list[shortname] = currentEmoji;
            });
        }
    }
    // Additional settings -- ascii emojis
    meteor_1.Meteor.startup(() => {
        Tracker.autorun(() => __awaiter(void 0, void 0, void 0, function* () {
            if ((yield (0, isSetNotNull_1.isSetNotNull)(() => client_1.emoji.packages.emojione)) && client_1.emoji.packages.emojione) {
                if (yield (0, isSetNotNull_1.isSetNotNull)(() => (0, client_2.getUserPreference)(meteor_1.Meteor.userId(), 'convertAsciiEmoji'))) {
                    client_1.emoji.packages.emojione.ascii = yield (0, client_2.getUserPreference)(meteor_1.Meteor.userId(), 'convertAsciiEmoji');
                }
                else {
                    client_1.emoji.packages.emojione.ascii = true;
                }
            }
        }));
    });
}
