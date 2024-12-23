"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderMetadata = void 0;
const meteor_1 = require("meteor/meteor");
const Utils_1 = require("../Utils");
const constants_1 = require("../constants");
/*
    The metadata will be available at the following url:
    [rocketchat-url]/_saml/metadata/[provider-name]
*/
class ServiceProviderMetadata {
    static generate(serviceProviderOptions) {
        const data = this.getData(serviceProviderOptions);
        return Utils_1.SAMLUtils.fillTemplateData(this.metadataTemplate(serviceProviderOptions), data);
    }
    static certificateTagTemplate(serviceProviderOptions) {
        if (!serviceProviderOptions.privateKey) {
            return '';
        }
        if (!serviceProviderOptions.privateCert) {
            throw new Error('Missing certificate while generating metadata for decrypting service provider');
        }
        return serviceProviderOptions.metadataCertificateTemplate || constants_1.defaultMetadataCertificateTemplate;
    }
    static metadataTemplate(serviceProviderOptions) {
        const data = {
            certificateTag: this.certificateTagTemplate(serviceProviderOptions),
        };
        const template = serviceProviderOptions.metadataTemplate || constants_1.defaultMetadataTemplate;
        return Utils_1.SAMLUtils.fillTemplateData(template, data);
    }
    static getData(serviceProviderOptions) {
        if (!serviceProviderOptions.callbackUrl) {
            throw new Error('Unable to generate service provider metadata when callbackUrl option is not set');
        }
        return {
            issuer: serviceProviderOptions.issuer,
            certificate: Utils_1.SAMLUtils.normalizeCert(serviceProviderOptions.privateCert),
            identifierFormat: serviceProviderOptions.identifierFormat || constants_1.defaultIdentifierFormat,
            callbackUrl: serviceProviderOptions.callbackUrl,
            sloLocation: `${meteor_1.Meteor.absoluteUrl()}_saml/logout/${serviceProviderOptions.provider}/`,
        };
    }
}
exports.ServiceProviderMetadata = ServiceProviderMetadata;
