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
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../settings/server");
const handleIdentityToken_1 = require("../lib/handleIdentityToken");
accounts_base_1.Accounts.registerLoginHandler('apple', (loginRequest) => __awaiter(void 0, void 0, void 0, function* () {
    if (!loginRequest.identityToken) {
        return;
    }
    if (!server_1.settings.get('Accounts_OAuth_Apple')) {
        return;
    }
    const { identityToken, fullName, email } = loginRequest;
    try {
        const serviceData = yield (0, handleIdentityToken_1.handleIdentityToken)(identityToken);
        if (!serviceData.email && email) {
            serviceData.email = email;
        }
        const profile = {};
        const { givenName, familyName } = fullName;
        if (givenName && familyName) {
            profile.name = `${givenName} ${familyName}`;
        }
        const result = accounts_base_1.Accounts.updateOrCreateUserFromExternalService('apple', serviceData, { profile });
        // Ensure processing succeeded
        if (result === undefined || result.userId === undefined) {
            return {
                type: 'apple',
                error: new meteor_1.Meteor.Error(accounts_base_1.Accounts.LoginCancelledError.numericError, 'User creation failed from Apple response token'),
            };
        }
        return result;
    }
    catch (error) {
        return {
            type: 'apple',
            error: new meteor_1.Meteor.Error(accounts_base_1.Accounts.LoginCancelledError.numericError, error.message),
        };
    }
}));
