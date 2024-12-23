"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeRequest = void 0;
const Utils_1 = require("../Utils");
const constants_1 = require("../constants");
/*
    An Authorize Request is used to show the Identity Provider login form when the user clicks on the Rocket.Chat SAML login button
*/
class AuthorizeRequest {
    static generate(serviceProviderOptions) {
        const data = this.getDataForNewRequest(serviceProviderOptions);
        const request = Utils_1.SAMLUtils.fillTemplateData(this.authorizeRequestTemplate(serviceProviderOptions), data);
        return {
            request,
            id: data.newId,
        };
    }
    // The AuthorizeRequest template is split into three parts
    // This way, users don't need to change the template when all they want to do is remove the NameID Policy or the AuthnContext.
    // This also ensures compatibility with providers that were configured before the templates existed.
    static authorizeRequestTemplate(serviceProviderOptions) {
        const data = {
            identifierFormatTag: this.identifierFormatTagTemplate(serviceProviderOptions),
            authnContextTag: this.authnContextTagTemplate(serviceProviderOptions),
        };
        const template = serviceProviderOptions.authRequestTemplate || constants_1.defaultAuthRequestTemplate;
        return Utils_1.SAMLUtils.fillTemplateData(template, data);
    }
    static identifierFormatTagTemplate(serviceProviderOptions) {
        if (!serviceProviderOptions.identifierFormat) {
            return '';
        }
        return serviceProviderOptions.nameIDPolicyTemplate || constants_1.defaultNameIDTemplate;
    }
    static authnContextTagTemplate(serviceProviderOptions) {
        if (!serviceProviderOptions.customAuthnContext) {
            return '';
        }
        return serviceProviderOptions.authnContextTemplate || constants_1.defaultAuthnContextTemplate;
    }
    static getDataForNewRequest(serviceProviderOptions) {
        let id = `_${Utils_1.SAMLUtils.generateUniqueID()}`;
        const instant = Utils_1.SAMLUtils.generateInstant();
        // Post-auth destination
        if (serviceProviderOptions.id) {
            id = serviceProviderOptions.id;
        }
        return {
            newId: id,
            instant,
            callbackUrl: serviceProviderOptions.callbackUrl,
            entryPoint: serviceProviderOptions.entryPoint,
            issuer: serviceProviderOptions.issuer,
            identifierFormat: serviceProviderOptions.identifierFormat || constants_1.defaultIdentifierFormat,
            authnContextComparison: serviceProviderOptions.authnContextComparison || 'exact',
            authnContext: serviceProviderOptions.customAuthnContext || constants_1.defaultAuthnContext,
        };
    }
}
exports.AuthorizeRequest = AuthorizeRequest;
