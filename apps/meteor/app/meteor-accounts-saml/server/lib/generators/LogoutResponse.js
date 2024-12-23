"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutResponse = void 0;
const Utils_1 = require("../Utils");
const constants_1 = require("../constants");
/*
    A Logout Response is used when the Identity Provider (IdP) sends us a Logout Request.
*/
class LogoutResponse {
    static generate(serviceProviderOptions, nameID, sessionIndex, inResponseToId) {
        const data = this.getDataForNewResponse(serviceProviderOptions, nameID, sessionIndex, inResponseToId);
        const response = Utils_1.SAMLUtils.fillTemplateData(serviceProviderOptions.logoutResponseTemplate || constants_1.defaultLogoutResponseTemplate, data);
        Utils_1.SAMLUtils.log('------- SAML Logout response -----------');
        Utils_1.SAMLUtils.log(response);
        return {
            response,
            id: data.newId,
            inResponseToId: data.inResponseToId,
        };
    }
    static getDataForNewResponse(serviceProviderOptions, nameID, sessionIndex, inResponseToId) {
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
            inResponseToId,
        };
    }
}
exports.LogoutResponse = LogoutResponse;
