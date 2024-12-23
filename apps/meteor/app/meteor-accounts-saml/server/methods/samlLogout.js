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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const ServiceProvider_1 = require("../lib/ServiceProvider");
const Utils_1 = require("../lib/Utils");
/**
 * Fetch SAML provider configs for given 'provider'.
 */
function getSamlServiceProviderOptions(provider) {
    if (!provider) {
        throw new meteor_1.Meteor.Error('no-saml-provider', 'SAML internal error', {
            method: 'getSamlServiceProviderOptions',
        });
    }
    const providers = Utils_1.SAMLUtils.serviceProviders;
    const samlProvider = function (element) {
        return element.provider === provider;
    };
    return providers.filter(samlProvider)[0];
}
meteor_1.Meteor.methods({
    samlLogout(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = meteor_1.Meteor.userId();
            // Make sure the user is logged in before we initiate SAML Logout
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'samlLogout' });
            }
            const providerConfig = getSamlServiceProviderOptions(provider);
            Utils_1.SAMLUtils.log({ msg: 'Logout request', providerConfig });
            // This query should respect upcoming array of SAML logins
            const user = yield models_1.Users.getSAMLByIdAndSAMLProvider(userId, provider);
            if (!((_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.saml)) {
                return;
            }
            const { nameID, idpSession } = user.services.saml;
            Utils_1.SAMLUtils.log({ msg: `NameID for user ${meteor_1.Meteor.userId()} found`, nameID });
            const _saml = new ServiceProvider_1.SAMLServiceProvider(providerConfig);
            if (!nameID || !idpSession) {
                Utils_1.SAMLUtils.log({ msg: 'No NameID or idpSession found for user', userId });
                return;
            }
            const request = _saml.generateLogoutRequest({
                nameID: nameID || idpSession,
                sessionIndex: idpSession,
            });
            Utils_1.SAMLUtils.log('----Logout Request----');
            Utils_1.SAMLUtils.log(request);
            // request.request: actual XML SAML Request
            // request.id: comminucation id which will be mentioned in the ResponseTo field of SAMLResponse
            yield models_1.Users.setSamlInResponseTo(userId, request.id);
            const result = yield _saml.requestToUrl(request.request, 'logout');
            Utils_1.SAMLUtils.log(`SAML Logout Request ${result}`);
            return result;
        });
    },
});
