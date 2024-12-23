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
const SAML_1 = require("./lib/SAML");
const Utils_1 = require("./lib/Utils");
const i18n_1 = require("../../../server/lib/i18n");
const system_1 = require("../../../server/lib/logger/system");
const makeError = (message) => ({
    type: 'saml',
    error: new meteor_1.Meteor.Error(accounts_base_1.Accounts.LoginCancelledError.numericError, message),
});
accounts_base_1.Accounts.registerLoginHandler('saml', (loginRequest) => __awaiter(void 0, void 0, void 0, function* () {
    if (!loginRequest.saml || !loginRequest.credentialToken || typeof loginRequest.credentialToken !== 'string') {
        return undefined;
    }
    const loginResult = yield SAML_1.SAML.retrieveCredential(loginRequest.credentialToken);
    Utils_1.SAMLUtils.log({ msg: 'RESULT', loginResult });
    if (!loginResult) {
        return makeError('No matching login attempt found');
    }
    if (!loginResult.profile) {
        return makeError('No profile information found');
    }
    try {
        const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(loginResult.profile);
        const updatedUser = yield SAML_1.SAML.insertOrUpdateSAMLUser(userObject);
        Utils_1.SAMLUtils.events.emit('updateCustomFields', loginResult, updatedUser);
        return updatedUser;
    }
    catch (error) {
        system_1.SystemLogger.error(error);
        let message = error.toString();
        let errorCode = '';
        if (error instanceof meteor_1.Meteor.Error) {
            errorCode = (error.error || error.message);
        }
        else if (error instanceof Error) {
            errorCode = error.message;
        }
        if (errorCode) {
            const localizedMessage = i18n_1.i18n.t(errorCode);
            if (localizedMessage && localizedMessage !== errorCode) {
                message = localizedMessage;
            }
        }
        return makeError(message);
    }
}));
