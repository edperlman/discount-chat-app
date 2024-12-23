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
exports.LogoutRequestParser = void 0;
const xmldom_1 = __importDefault(require("@xmldom/xmldom"));
const Utils_1 = require("../Utils");
class LogoutRequestParser {
    constructor(serviceProviderOptions) {
        this.serviceProviderOptions = serviceProviderOptions;
    }
    validate(xmlString, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils_1.SAMLUtils.log(`LogoutRequest: ${xmlString}`);
            const doc = new xmldom_1.default.DOMParser().parseFromString(xmlString, 'text/xml');
            if (!doc) {
                return callback('No Doc Found');
            }
            const request = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'LogoutRequest')[0];
            if (!request) {
                return callback('No Request Found');
            }
            try {
                const sessionNode = request.getElementsByTagNameNS('*', 'SessionIndex')[0];
                const nameIdNode = request.getElementsByTagNameNS('*', 'NameID')[0];
                if (!nameIdNode) {
                    throw new Error('SAML Logout Request: No NameID node found');
                }
                const idpSession = sessionNode.childNodes[0].nodeValue;
                const nameID = nameIdNode.childNodes[0].nodeValue;
                const id = request.getAttribute('ID');
                return callback(null, { idpSession, nameID, id });
            }
            catch (e) {
                Utils_1.SAMLUtils.error(e);
                Utils_1.SAMLUtils.log(`Caught error: ${e}`);
                const msg = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'StatusMessage');
                Utils_1.SAMLUtils.log(`Unexpected msg from IDP. Does your session still exist at IDP? Idp returned: \n ${msg}`);
                return callback(e instanceof Error ? e : String(e), null);
            }
        });
    }
}
exports.LogoutRequestParser = LogoutRequestParser;
