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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutResponseParser = void 0;
const xmldom_1 = __importDefault(require("@xmldom/xmldom"));
const Utils_1 = require("../Utils");
class LogoutResponseParser {
    constructor(serviceProviderOptions) {
        this.serviceProviderOptions = serviceProviderOptions;
    }
    validate(xmlString, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils_1.SAMLUtils.log(`LogoutResponse: ${xmlString}`);
            const doc = new xmldom_1.default.DOMParser().parseFromString(xmlString, 'text/xml');
            if (!doc) {
                return callback('No Doc Found');
            }
            const response = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'LogoutResponse')[0];
            if (!response) {
                return callback('No Response Found', null);
            }
            // TBD. Check if this msg corresponds to one we sent
            let inResponseTo;
            try {
                inResponseTo = response.getAttribute('InResponseTo');
                Utils_1.SAMLUtils.log(`In Response to: ${inResponseTo}`);
            }
            catch (e) {
                Utils_1.SAMLUtils.log(`Caught error: ${e}`);
                const msg = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'StatusMessage');
                Utils_1.SAMLUtils.log(`Unexpected msg from IDP. Does your session still exist at IDP? Idp returned: \n ${msg}`);
            }
            if (!inResponseTo) {
                return callback('Unexpected Response from IDP', null);
            }
            const statusValidateObj = Utils_1.SAMLUtils.validateStatus(doc);
            if (!statusValidateObj.success) {
                return callback('Error. Logout not confirmed by IDP', null);
            }
            return callback(null, inResponseTo);
        });
    }
}
exports.LogoutResponseParser = LogoutResponseParser;
