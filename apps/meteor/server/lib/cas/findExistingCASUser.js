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
exports.findExistingCASUser = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const findExistingCASUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const casUser = yield models_1.Users.findOne({ 'services.cas.external_id': username });
    if (casUser) {
        return casUser;
    }
    if (!server_1.settings.get('CAS_trust_username')) {
        return;
    }
    // If that user was not found, check if there's any Rocket.Chat user with that username
    // With this, CAS login will continue to work if the user is renamed on both sides and also if the user is renamed only on Rocket.Chat.
    // It'll also allow non-CAS users to switch to CAS based login
    // #TODO: Remove regex based search
    const regex = new RegExp(`^${username}$`, 'i');
    const user = yield models_1.Users.findOne({ username: regex });
    if (user) {
        // Update the user's external_id to reflect this new username.
        yield models_1.Users.updateOne({ _id: user._id }, { $set: { 'services.cas.external_id': username } });
        return user;
    }
});
exports.findExistingCASUser = findExistingCASUser;
