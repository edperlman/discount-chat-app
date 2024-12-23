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
const insertOrUpdateEmoji_1 = require("../lib/insertOrUpdateEmoji");
meteor_1.Meteor.methods({
    insertOrUpdateEmoji(emojiData) {
        return __awaiter(this, void 0, void 0, function* () {
            const emoji = yield (0, insertOrUpdateEmoji_1.insertOrUpdateEmoji)(this.userId, emojiData);
            if (!emojiData._id) {
                return emoji._id;
            }
            return !!emoji;
        });
    },
});
