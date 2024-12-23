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
exports.APIClient = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
const api_client_1 = require("@rocket.chat/api-client");
const accounts_base_1 = require("meteor/accounts-base");
const process2faReturn_1 = require("../../../../client/lib/2fa/process2faReturn");
const baseURI_1 = require("../../../../client/lib/baseURI");
class RestApiClient extends api_client_1.RestClient {
    getCredentials() {
        const [uid, token] = [
            accounts_base_1.Accounts.storageLocation.getItem(accounts_base_1.Accounts.USER_ID_KEY),
            accounts_base_1.Accounts.storageLocation.getItem(accounts_base_1.Accounts.LOGIN_TOKEN_KEY),
        ];
        if (!uid || !token) {
            return;
        }
        return {
            'X-User-Id': uid,
            'X-Auth-Token': token,
        };
    }
}
exports.APIClient = new RestApiClient({
    baseUrl: baseURI_1.baseURI.replace(/\/$/, ''),
});
exports.APIClient.handleTwoFactorChallenge(process2faReturn_1.invokeTwoFactorModal);
/**
 * The original rest api code throws the Response object, which is very useful
 * for the client sometimes, if the developer wants to access more information about the error
 * unfortunately/fortunately Rocket.Chat expects an error object (from Response.json()
 * This middleware will throw the error object instead.
 * */
exports.APIClient.use((request, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield next(...request);
    }
    catch (error) {
        if (error instanceof Response) {
            const e = yield error.json();
            throw e;
        }
        throw error;
    }
}));
