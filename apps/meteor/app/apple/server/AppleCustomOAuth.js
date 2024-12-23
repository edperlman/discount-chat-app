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
exports.AppleCustomOAuth = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const accounts_base_1 = require("meteor/accounts-base");
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const handleIdentityToken_1 = require("../lib/handleIdentityToken");
class AppleCustomOAuth extends custom_oauth_server_1.CustomOAuth {
    getIdentity(_accessToken, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_token: identityToken, user: userStr = '' } = query;
            let usrObj = {};
            try {
                usrObj = JSON.parse(userStr);
            }
            catch (e) {
                // ignore
            }
            try {
                const serviceData = yield (0, handleIdentityToken_1.handleIdentityToken)(identityToken);
                if (usrObj === null || usrObj === void 0 ? void 0 : usrObj.name) {
                    serviceData.name = `${usrObj.name.firstName}${usrObj.name.middleName ? ` ${usrObj.name.middleName}` : ''}${usrObj.name.lastName ? ` ${usrObj.name.lastName}` : ''}`;
                }
                return serviceData;
            }
            catch (error) {
                return {
                    type: 'apple',
                    error: new core_services_1.MeteorError(accounts_base_1.Accounts.LoginCancelledError.numericError, error.message),
                };
            }
        });
    }
}
exports.AppleCustomOAuth = AppleCustomOAuth;
