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
exports.SAMLServiceProvider = void 0;
const crypto_1 = __importDefault(require("crypto"));
const querystring_1 = __importDefault(require("querystring"));
const util_1 = __importDefault(require("util"));
const zlib_1 = __importDefault(require("zlib"));
const meteor_1 = require("meteor/meteor");
const Utils_1 = require("./Utils");
const AuthorizeRequest_1 = require("./generators/AuthorizeRequest");
const LogoutRequest_1 = require("./generators/LogoutRequest");
const LogoutResponse_1 = require("./generators/LogoutResponse");
const ServiceProviderMetadata_1 = require("./generators/ServiceProviderMetadata");
const LogoutRequest_2 = require("./parsers/LogoutRequest");
const LogoutResponse_2 = require("./parsers/LogoutResponse");
const Response_1 = require("./parsers/Response");
class SAMLServiceProvider {
    constructor(serviceProviderOptions) {
        if (!serviceProviderOptions) {
            throw new Error('SAMLServiceProvider instantiated without an options object');
        }
        this.serviceProviderOptions = serviceProviderOptions;
    }
    signRequest(xml) {
        const signer = crypto_1.default.createSign('RSA-SHA1');
        signer.update(xml);
        return signer.sign(this.serviceProviderOptions.privateKey, 'base64');
    }
    generateAuthorizeRequest() {
        const identifiedRequest = AuthorizeRequest_1.AuthorizeRequest.generate(this.serviceProviderOptions);
        return identifiedRequest.request;
    }
    generateLogoutResponse({ nameID, sessionIndex, inResponseToId, }) {
        return LogoutResponse_1.LogoutResponse.generate(this.serviceProviderOptions, nameID, sessionIndex, inResponseToId);
    }
    generateLogoutRequest({ nameID, sessionIndex }) {
        return LogoutRequest_1.LogoutRequest.generate(this.serviceProviderOptions, nameID, sessionIndex);
    }
    /*
        This method will generate the response URL with all the query string params and pass it to the callback
    */
    logoutResponseToUrl(response, callback) {
        zlib_1.default.deflateRaw(response, (err, buffer) => {
            if (err) {
                return callback(err);
            }
            try {
                const base64 = buffer.toString('base64');
                let target = this.serviceProviderOptions.idpSLORedirectURL;
                if (target.indexOf('?') > 0) {
                    target += '&';
                }
                else {
                    target += '?';
                }
                // TBD. We should really include a proper RelayState here
                const relayState = meteor_1.Meteor.absoluteUrl();
                const samlResponse = {
                    SAMLResponse: base64,
                    RelayState: relayState,
                };
                if (this.serviceProviderOptions.privateCert) {
                    samlResponse.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
                    samlResponse.Signature = this.signRequest(querystring_1.default.stringify(samlResponse));
                }
                target += querystring_1.default.stringify(samlResponse);
                return callback(null, target);
            }
            catch (error) {
                return callback(error instanceof Error ? error : String(error));
            }
        });
    }
    /*
        This method will generate the request URL with all the query string params and pass it to the callback
    */
    requestToUrl(request, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield util_1.default.promisify(zlib_1.default.deflateRaw)(request);
            try {
                const base64 = buffer.toString('base64');
                let target = this.serviceProviderOptions.entryPoint;
                if (operation === 'logout') {
                    if (this.serviceProviderOptions.idpSLORedirectURL) {
                        target = this.serviceProviderOptions.idpSLORedirectURL;
                    }
                }
                if (target.indexOf('?') > 0) {
                    target += '&';
                }
                else {
                    target += '?';
                }
                // TBD. We should really include a proper RelayState here
                let relayState;
                if (operation === 'logout') {
                    // in case of logout we want to be redirected back to the Meteor app.
                    relayState = meteor_1.Meteor.absoluteUrl();
                }
                else {
                    relayState = this.serviceProviderOptions.provider;
                }
                const samlRequest = {
                    SAMLRequest: base64,
                    RelayState: relayState,
                };
                if (this.serviceProviderOptions.privateCert) {
                    samlRequest.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
                    samlRequest.Signature = this.signRequest(querystring_1.default.stringify(samlRequest));
                }
                target += querystring_1.default.stringify(samlRequest);
                Utils_1.SAMLUtils.log(`requestToUrl: ${target}`);
                if (operation === 'logout') {
                    // in case of logout we want to be redirected back to the Meteor app.
                    return target;
                }
                return target;
            }
            catch (error) {
                throw error instanceof Error ? error : String(error);
            }
        });
    }
    getAuthorizeUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = this.generateAuthorizeRequest();
            Utils_1.SAMLUtils.log('-----REQUEST------');
            Utils_1.SAMLUtils.log(request);
            return this.requestToUrl(request, 'authorize');
        });
    }
    validateLogoutRequest(samlRequest, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Utils_1.SAMLUtils.inflateXml(samlRequest, (xml) => __awaiter(this, void 0, void 0, function* () {
                const parser = new LogoutRequest_2.LogoutRequestParser(this.serviceProviderOptions);
                return parser.validate(xml, callback);
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                yield callback(err, null);
            }));
        });
    }
    validateLogoutResponse(samlResponse, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Utils_1.SAMLUtils.inflateXml(samlResponse, (xml) => __awaiter(this, void 0, void 0, function* () {
                const parser = new LogoutResponse_2.LogoutResponseParser(this.serviceProviderOptions);
                return parser.validate(xml, callback);
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                yield callback(err, null);
            }));
        });
    }
    validateResponse(samlResponse, callback) {
        const xml = Buffer.from(samlResponse, 'base64').toString('utf8');
        const parser = new Response_1.ResponseParser(this.serviceProviderOptions);
        return parser.validate(xml, callback);
    }
    generateServiceProviderMetadata() {
        return ServiceProviderMetadata_1.ServiceProviderMetadata.generate(this.serviceProviderOptions);
    }
}
exports.SAMLServiceProvider = SAMLServiceProvider;
