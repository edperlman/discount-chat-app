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
exports.joinDefaultChannels = void 0;
const models_1 = require("@rocket.chat/models");
const addUserToDefaultChannels_1 = require("./addUserToDefaultChannels");
const joinDefaultChannels = (userId, silenced) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.Users.findOneById(userId);
    if (!user) {
        throw new Meteor.Error('error-invalid-user', 'Invalid user');
    }
    return (0, addUserToDefaultChannels_1.addUserToDefaultChannels)(user, Boolean(silenced));
});
exports.joinDefaultChannels = joinDefaultChannels;
