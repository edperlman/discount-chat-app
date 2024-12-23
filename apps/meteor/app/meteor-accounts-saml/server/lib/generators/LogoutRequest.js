"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutRequest = void 0;
const Utils_1 = require("../Utils");
const constants_1 = require("../constants");
/*
    A Logout Request is used when the user is logged out of Rocket.Chat and the Service Provider is configured to also logout from the Identity Provider.
*/
class LogoutRequest {
    static generate(serviceProviderOptions, nameID, sessionIndex) {
        const data = this.getDataForNewRequest(serviceProviderOptions, nameID, sessionIndex);
        const request = Utils_1.SAMLUtils.fillTemplateData(serviceProviderOptions.logoutRequestTemplate || constants_1.defaultLogoutRequestTemplate, data);
        Utils_1.SAMLUtils.log('------- SAML Logout request -----------');
        Utils_1.SAMLUtils.log(request);
        return {
            request,
            id: data.newId,
        };
    }
    static getDataForNewRequest(serviceProviderOptions, nameID, sessionIndex) {
        // nameId: <nameId as submitted during SAML SSO>
        // sessionIndex: sessionIndex
        // --- NO SAMLsettings: <Meteor.setting.saml  entry for the provider you want to SLO from
        const id = `_${Utils_1.SAMLUtils.generateUniqueID()}`;
        const instant = Utils_1.SAMLUtils.generateInstant();
        return {
            newId: id,
            instant,
            idpSLORedirectURL: serviceProviderOptions.idpSLORedirectURL,
            issuer: serviceProviderOptions.issuer,
            identifierFormat: serviceProviderOptions.identifierFormat || constants_1.defaultIdentifierFormat,
            nameID,
            sessionIndex,
        };
    }
}
exports.LogoutRequest = LogoutRequest;
