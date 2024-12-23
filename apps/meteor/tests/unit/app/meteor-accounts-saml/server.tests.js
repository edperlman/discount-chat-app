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
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const data_1 = require("./data");
const Utils_1 = require("../../../../app/meteor-accounts-saml/server/lib/Utils");
const AuthorizeRequest_1 = require("../../../../app/meteor-accounts-saml/server/lib/generators/AuthorizeRequest");
const LogoutRequest_1 = require("../../../../app/meteor-accounts-saml/server/lib/generators/LogoutRequest");
const LogoutResponse_1 = require("../../../../app/meteor-accounts-saml/server/lib/generators/LogoutResponse");
const LogoutRequest_2 = require("../../../../app/meteor-accounts-saml/server/lib/parsers/LogoutRequest");
const LogoutResponse_2 = require("../../../../app/meteor-accounts-saml/server/lib/parsers/LogoutResponse");
const Response_1 = require("../../../../app/meteor-accounts-saml/server/lib/parsers/Response");
const isTruthy_1 = require("../../../../lib/isTruthy");
const { ServiceProviderMetadata } = proxyquire_1.default
    .noCallThru()
    .load('../../../../app/meteor-accounts-saml/server/lib/generators/ServiceProviderMetadata', {
    'meteor/meteor': {
        Meteor: {
            absoluteUrl() {
                return 'http://localhost:3000/';
            },
        },
    },
});
describe('SAML', () => {
    describe('[AuthorizeRequest]', () => {
        describe('AuthorizeRequest.generate', () => {
            it('should use the custom templates to generate the request', () => {
                const authorizeRequest = AuthorizeRequest_1.AuthorizeRequest.generate(data_1.serviceProviderOptions);
                (0, chai_1.expect)(authorizeRequest.request).to.be.equal('<authRequest><NameID IdentifierFormat="email"/> <authnContext Comparison="Whatever">Password</authnContext> </authRequest>');
            });
            it('should include the unique ID on the request', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { authRequestTemplate: '__newId__' });
                const authorizeRequest = AuthorizeRequest_1.AuthorizeRequest.generate(customOptions);
                (0, chai_1.expect)(authorizeRequest.request).to.be.equal(authorizeRequest.id);
            });
            it('should include the custom options on the request', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { authRequestTemplate: '__callbackUrl__ __entryPoint__ __issuer__' });
                const authorizeRequest = AuthorizeRequest_1.AuthorizeRequest.generate(customOptions);
                (0, chai_1.expect)(authorizeRequest.request).to.be.equal('[callback-url] [entry-point] [issuer]');
            });
        });
    });
    describe('[LogoutRequest]', () => {
        describe('LogoutRequest.generate', () => {
            it('should use the custom template to generate the request', () => {
                const logoutRequest = LogoutRequest_1.LogoutRequest.generate(data_1.serviceProviderOptions, 'NameID', 'sessionIndex');
                (0, chai_1.expect)(logoutRequest.request).to.be.equal('[logout-request-template]');
            });
            it('should include the unique ID on the request', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { logoutRequestTemplate: '__newId__' });
                const logoutRequest = LogoutRequest_1.LogoutRequest.generate(customOptions, 'NameID', 'sessionIndex');
                (0, chai_1.expect)(logoutRequest.request).to.be.equal(logoutRequest.id);
            });
            it('should include the custom options on the request', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { logoutRequestTemplate: '__idpSLORedirectURL__ __issuer__ __identifierFormat__ __nameID__ __sessionIndex__' });
                const logoutRequest = LogoutRequest_1.LogoutRequest.generate(customOptions, 'NameID', 'sessionIndex');
                (0, chai_1.expect)(logoutRequest.request).to.be.equal('[idpSLORedirectURL] [issuer] email NameID sessionIndex');
            });
        });
        describe('LogoutRequest.validate', () => {
            it('should extract the idpSession and nameID from the request', () => {
                const parser = new LogoutRequest_2.LogoutRequestParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.simpleLogoutRequest, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.null;
                    (0, chai_1.expect)(data).to.be.an('object');
                    (0, chai_1.expect)(data).to.have.property('idpSession');
                    (0, chai_1.expect)(data).to.have.property('nameID');
                    // @ts-ignore -- chai already ensured the object exists
                    (0, chai_1.expect)(data.idpSession).to.be.equal('_d6ad0e25459aaddd0433a81e159aa79e55dc52c280');
                    // @ts-ignore -- chai already ensured the object exists
                    (0, chai_1.expect)(data.nameID).to.be.equal('_ab7e1d9a603473e92148d569d50176bafa60bcb2e9');
                }));
            });
            it('should fail to parse an invalid xml', () => {
                const parser = new LogoutRequest_2.LogoutRequestParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.invalidXml, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.exist;
                    (0, chai_1.expect)(data).to.not.exist;
                }));
            });
            it('should fail to parse a xml without any LogoutRequest tag', () => {
                const parser = new LogoutRequest_2.LogoutRequestParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.randomXml, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.equal('No Request Found');
                    (0, chai_1.expect)(data).to.not.exist;
                }));
            });
            it('should fail to parse a request with no NameId', () => {
                const parser = new LogoutRequest_2.LogoutRequestParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.invalidLogoutRequest, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').equal('SAML Logout Request: No NameID node found');
                    (0, chai_1.expect)(data).to.not.exist;
                }));
            });
        });
    });
    describe('[LogoutResponse]', () => {
        describe('LogoutResponse.generate', () => {
            it('should use the custom template to generate the response', () => {
                const logoutResponse = LogoutResponse_1.LogoutResponse.generate(data_1.serviceProviderOptions, 'NameID', 'sessionIndex', 'inResponseToId');
                (0, chai_1.expect)(logoutResponse.response).to.be.equal('[logout-response-template]');
            });
            it('should include the unique ID on the response', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { logoutResponseTemplate: '__newId__' });
                const logoutResponse = LogoutResponse_1.LogoutResponse.generate(customOptions, 'NameID', 'sessionIndex', 'inResponseToId');
                (0, chai_1.expect)(logoutResponse.response).to.be.equal(logoutResponse.id);
            });
            it('should include the custom options on the response', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { logoutResponseTemplate: '__idpSLORedirectURL__ __issuer__' });
                const logoutResponse = LogoutResponse_1.LogoutResponse.generate(customOptions, 'NameID', 'sessionIndex', 'inResponseToId');
                (0, chai_1.expect)(logoutResponse.response).to.be.equal('[idpSLORedirectURL] [issuer]');
            });
        });
        describe('LogoutResponse.validate', () => {
            it('should extract the inResponseTo from the response', () => {
                const logoutResponse = data_1.simpleLogoutResponse.replace('[STATUSCODE]', 'urn:oasis:names:tc:SAML:2.0:status:Success');
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(logoutResponse, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.null;
                    (0, chai_1.expect)(inResponseTo).to.be.equal('_id-6530db3fcd23dc42a31c');
                }));
            });
            it('should reject a response with a non-success StatusCode', () => {
                const logoutResponse = data_1.simpleLogoutResponse.replace('[STATUSCODE]', 'Anything');
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(logoutResponse, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.equal('Error. Logout not confirmed by IDP');
                    (0, chai_1.expect)(inResponseTo).to.be.null;
                }));
            });
            it('should fail to parse an invalid xml', () => {
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.invalidXml, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.exist;
                    (0, chai_1.expect)(inResponseTo).to.not.exist;
                }));
            });
            it('should fail to parse a xml without any LogoutResponse tag', () => {
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.randomXml, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.equal('No Response Found');
                    (0, chai_1.expect)(inResponseTo).to.not.exist;
                }));
            });
            it('should fail to parse a xml without an inResponseTo attribute', () => {
                const instant = new Date().toISOString();
                const logoutResponse = data_1.simpleLogoutResponse
                    .replace('[INSTANT]', instant)
                    .replace('[STATUSCODE]', 'urn:oasis:names:tc:SAML:2.0:status:Success')
                    .replace('InResponseTo=', 'SomethingElse=');
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(logoutResponse, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.equal('Unexpected Response from IDP');
                    (0, chai_1.expect)(inResponseTo).to.not.exist;
                }));
            });
            it('should reject a response with no status tag', () => {
                const parser = new LogoutResponse_2.LogoutResponseParser(data_1.serviceProviderOptions);
                void parser.validate(data_1.invalidLogoutResponse, (err, inResponseTo) => __awaiter(void 0, void 0, void 0, function* () {
                    (0, chai_1.expect)(err).to.be.equal('Error. Logout not confirmed by IDP');
                    (0, chai_1.expect)(inResponseTo).to.be.null;
                }));
            });
        });
    });
    describe('[Metadata]', () => {
        describe('[Metadata.generate]', () => {
            it('should generate a simple metadata file when no certificate info is included', () => {
                const metadata = ServiceProviderMetadata.generate(data_1.serviceProviderOptions);
                (0, chai_1.expect)(metadata).to.be.equal(data_1.simpleMetadata);
            });
            it('should include additional information when a certificate is provided', () => {
                const customOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { privateCert: '[CERTIFICATE_CONTENT]', privateKey: '[PRIVATE_KEY]' });
                const metadata = ServiceProviderMetadata.generate(customOptions);
                (0, chai_1.expect)(metadata).to.be.equal(data_1.metadataWithCertificate);
            });
        });
    });
    describe('[Response]', () => {
        describe('[Response.validate]', () => {
            it('should extract a profile from the response', () => {
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.simpleSamlResponse
                    .replace('[NOTBEFORE]', notBefore.toISOString())
                    .replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(response, (err, profile, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.null;
                    (0, chai_1.expect)(profile).to.be.an('object');
                    (0, chai_1.expect)(profile).to.have.property('inResponseToId').equal('[INRESPONSETO]');
                    (0, chai_1.expect)(profile).to.have.property('issuer').equal('[ISSUER]');
                    (0, chai_1.expect)(profile).to.have.property('nameID').equal('[NAMEID]');
                    (0, chai_1.expect)(profile).to.have.property('sessionIndex').equal('[SESSIONINDEX]');
                    (0, chai_1.expect)(profile).to.have.property('uid').equal('1');
                    (0, chai_1.expect)(profile).to.have.property('eduPersonAffiliation').equal('group1');
                    (0, chai_1.expect)(profile).to.have.property('email').equal('user1@example.com');
                    (0, chai_1.expect)(profile).to.have.property('channels').that.is.an('array').that.is.deep.equal(['channel1', 'pets', 'random']);
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should respect NotOnOrAfter conditions', () => {
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const response = data_1.samlResponse.replace('[NOTBEFORE]', notBefore.toISOString()).replace('[NOTONORAFTER]', new Date().toISOString());
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(response, (err, profile, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(profile).to.be.null;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should respect NotBefore conditions', () => {
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() + 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.samlResponse.replace('[NOTBEFORE]', notBefore.toISOString()).replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(response, (err, profile, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(profile).to.be.null;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should fail to parse an invalid xml', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.invalidXml, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Unknown SAML response message');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should fail to parse a xml without any Response tag', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.randomXml, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Unknown SAML response message');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject a xml with multiple responses', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.duplicatedSamlResponse, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should fail to parse a reponse with no Status tag', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.samlResponseMissingStatus, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Missing StatusCode');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should fail to parse a reponse with a failed status', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.samlResponseFailedStatus, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Status is: Failed');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject a response with multiple assertions', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.samlResponseMultipleAssertions, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Too many SAML assertions');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject a response with no assertions', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.samlResponseMissingAssertion, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Missing SAML assertion');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject a document without signatures if the setting requires at least one', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Either', cert: 'invalidCert' });
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.simpleSamlResponse
                    .replace('[NOTBEFORE]', notBefore.toISOString())
                    .replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(response, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('No valid SAML Signature found');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject a document with multiple issuers', () => {
                const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
                parser.validate(data_1.samlResponseMultipleIssuers, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Too many Issuers');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should decrypt an encrypted response', () => {
                const options = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { privateCert: data_1.privateKeyCert, privateKey: data_1.privateKey });
                const parser = new Response_1.ResponseParser(options);
                parser.validate(data_1.encryptedResponse, (err, profile, loggedOut) => {
                    // No way to change the assertion conditions on an encrypted response ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should validate signatures on an encrypted response', () => {
                const options = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { privateCert: data_1.privateKeyCert, signatureValidationType: 'All', privateKey: data_1.privateKey });
                const parser = new Response_1.ResponseParser(options);
                parser.validate(data_1.encryptedResponse, (err, profile, loggedOut) => {
                    // No way to change the assertion conditions on an encrypted response ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
        });
        describe('[Validate Signatures]', () => {
            it('should reject an unsigned assertion if the setting says so', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Assertion', cert: 'invalidCert' });
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.simpleSamlResponse
                    .replace('[NOTBEFORE]', notBefore.toISOString())
                    .replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(response, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Invalid Assertion signature');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject an unsigned response if the setting says so', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Response', cert: 'invalidCert' });
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.simpleSamlResponse
                    .replace('[NOTBEFORE]', notBefore.toISOString())
                    .replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(response, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Invalid Signature');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should reject an assertion signed with an invalid signature', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Assertion', cert: data_1.certificate });
                const notBefore = new Date();
                notBefore.setMinutes(notBefore.getMinutes() - 3);
                const notOnOrAfter = new Date();
                notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
                const response = data_1.samlResponse.replace('[NOTBEFORE]', notBefore.toISOString()).replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(response, (err, data, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Invalid Assertion signature');
                    (0, chai_1.expect)(data).to.not.exist;
                    (0, chai_1.expect)(loggedOut).to.be.false;
                });
            });
            it('should accept an assertion with a valid signature', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Assertion', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidAssertionSignature, (err, profile, loggedOut) => {
                    // To have a valid signature, we can't change the assertion conditions ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should accept a document with a valid response signature', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Response', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidSignatures, (err, profile, loggedOut) => {
                    // To have a valid signature, we can't change the assertion conditions ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should reject a document with a valid signature of the wrong type', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Response', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidAssertionSignature, (err, profile, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Invalid Signature');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should accept a document with both valid signatures', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'All', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidSignatures, (err, profile, loggedOut) => {
                    // To have a valid signature, we can't change the assertion conditions ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should reject a document with a single signature when both are expected', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'All', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidAssertionSignature, (err, profile, loggedOut) => {
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('Invalid Signature');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
            it('should accept a document with either valid signature', () => {
                const providerOptions = Object.assign(Object.assign({}, data_1.serviceProviderOptions), { signatureValidationType: 'Either', cert: data_1.certificate });
                const parser = new Response_1.ResponseParser(providerOptions);
                parser.validate(data_1.samlResponseValidAssertionSignature, (err, profile, loggedOut) => {
                    // To have a valid signature, we can't change the assertion conditions ¯\_(ツ)_/¯
                    (0, chai_1.expect)(err).to.be.an('error').that.has.property('message').that.is.equal('NotBefore / NotOnOrAfter assertion failed');
                    (0, chai_1.expect)(loggedOut).to.be.false;
                    (0, chai_1.expect)(profile).to.be.null;
                });
            });
        });
    });
    describe('[Login]', () => {
        describe('UserMapping', () => {
            it('should collect all appropriate data from the profile, respecting the fieldMap', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: 'anotherUsername',
                    email: 'singleEmail',
                    name: 'anotherName',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                Utils_1.SAMLUtils.relayState = '[RelayState]';
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('samlLogin').that.is.an('object');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.provider').that.is.equal('[RelayState]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.idp').that.is.equal('[IssuerName]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.idpSession').that.is.equal('[SessionIndex]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.nameID').that.is.equal('[nameID]');
                (0, chai_1.expect)(userObject).to.have.property('emailList').that.is.an('array').that.includes('testing@server.com');
                (0, chai_1.expect)(userObject).to.have.property('fullName').that.is.equal('[AnotherName]');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('[AnotherUserName]');
                (0, chai_1.expect)(userObject).to.not.have.property('roles');
                (0, chai_1.expect)(userObject).to.have.property('channels').that.is.an('array').with.members(['pets', 'pics', 'funny', 'random', 'babies']);
            });
            it('should join array values if username receives an array of values', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const multipleUsernames = Object.assign(Object.assign({}, data_1.profile), { anotherUsername: ['user1', 'user2'] });
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(multipleUsernames);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('samlLogin').that.is.an('object');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('user1 user2');
            });
            // Channels support both a comma separated single value and an array of values
            it('should support `channels` attribute with multiple values', () => {
                const channelsProfile = Object.assign(Object.assign({}, data_1.profile), { channels: ['pets', 'pics', 'funny'] });
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(channelsProfile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('channels').that.is.an('array').with.members(['pets', 'pics', 'funny']);
            });
            it('should reject an userDataFieldMap without an email field', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                globalSettings.userDataFieldMap = JSON.stringify({});
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                (0, chai_1.expect)(() => {
                    Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                }).to.throw('SAML Profile did not contain an email address');
            });
            it('should fail to map a profile that is missing the email field', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    inexistentField: 'email',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                (0, chai_1.expect)(() => {
                    Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                }).to.throw('SAML Profile did not contain an email address');
            });
            it('should load data from the default fields when the field map is lacking', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    email: 'singleEmail',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('fullName').that.is.equal('[DisplayName]');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('[username]');
            });
            it('should run custom regexes when one is used', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: {
                        fieldName: 'singleEmail',
                        regex: '(.*)@.+$',
                    },
                    email: 'singleEmail',
                    name: 'anotherName',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                Utils_1.SAMLUtils.relayState = '[RelayState]';
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('testing');
            });
            it('should run custom templates when one is used', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: {
                        fieldName: 'anotherName',
                        template: 'user-__anotherName__',
                    },
                    email: 'singleEmail',
                    name: {
                        fieldNames: ['anotherName', 'displayName'],
                        template: '__displayName__ (__anotherName__)',
                    },
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                Utils_1.SAMLUtils.relayState = '[RelayState]';
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('user-[AnotherName]');
                (0, chai_1.expect)(userObject).to.have.property('fullName').that.is.equal('[DisplayName] ([AnotherName])');
            });
            it('should combine regexes and templates when both are used', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: {
                        fieldName: 'anotherName',
                        template: 'user-__anotherName__45@7',
                        regex: 'user-(.*)@',
                    },
                    email: 'singleEmail',
                    name: {
                        fieldNames: ['anotherName', 'displayName'],
                        regex: '\\[(.*)\\]',
                        template: '__displayName__ (__regex__)',
                    },
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                Utils_1.SAMLUtils.relayState = '[RelayState]';
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                // should run the template first, then the regex
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('[AnotherName]45');
                // for this one, should run the regex first, then the template
                (0, chai_1.expect)(userObject).to.have.property('fullName').that.is.equal('[DisplayName] (AnotherName)');
            });
            it('should support individual array values on templates', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const multipleUsernames = Object.assign(Object.assign({}, data_1.profile), { anotherUsername: ['1', '2'] });
                const fieldMap = {
                    username: {
                        fieldName: 'anotherUsername',
                        template: 'user-__anotherUsername[-1]__',
                    },
                    email: {
                        fieldName: 'anotherUsername',
                        template: 'user-__anotherUsername[0]__',
                    },
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(multipleUsernames);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('user-2');
                (0, chai_1.expect)(userObject).to.have.property('emailList').that.is.an('array').that.includes('user-1');
            });
            it('should collect the values of every attribute on the field map', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: 'anotherUsername',
                    email: 'singleEmail',
                    name: 'anotherName',
                    others: {
                        fieldNames: ['issuer', 'sessionIndex', 'nameID', 'displayName', 'username', 'roles', 'otherRoles', 'language', 'channels'],
                    },
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject)
                    .to.have.property('attributeList')
                    .that.is.a('Map')
                    .that.have.keys([
                    'anotherUsername',
                    'singleEmail',
                    'anotherName',
                    'issuer',
                    'sessionIndex',
                    'nameID',
                    'displayName',
                    'username',
                    'roles',
                    'otherRoles',
                    'language',
                    'channels',
                ]);
                // Workaround because chai doesn't handle Maps very well
                for (const [key, value] of userObject.attributeList) {
                    (0, chai_1.expect)(value).to.be.equal(data_1.profile[key]);
                }
            });
            it('should use the immutable property as default identifier', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                globalSettings.immutableProperty = 'EMail';
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('identifier').that.has.property('type').that.is.equal('email');
                globalSettings.immutableProperty = 'Username';
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const newUserObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(newUserObject).to.be.an('object');
                (0, chai_1.expect)(newUserObject).to.have.property('identifier').that.has.property('type').that.is.equal('username');
            });
            it('should collect the identifier from the fieldset', () => {
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: 'anotherUsername',
                    email: 'singleEmail',
                    name: 'anotherName',
                    __identifier__: 'customField3',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(data_1.profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('identifier').that.has.property('type').that.is.equal('custom');
                (0, chai_1.expect)(userObject).to.have.property('identifier').that.has.property('attribute').that.is.equal('customField3');
            });
        });
    });
    describe('Response Mapping', () => {
        it('should extract a mapped user from the response', () => {
            const notBefore = new Date();
            notBefore.setMinutes(notBefore.getMinutes() - 3);
            const notOnOrAfter = new Date();
            notOnOrAfter.setMinutes(notOnOrAfter.getMinutes() + 3);
            const response = data_1.simpleSamlResponse
                .replace('[NOTBEFORE]', notBefore.toISOString())
                .replace('[NOTONORAFTER]', notOnOrAfter.toISOString());
            const parser = new Response_1.ResponseParser(data_1.serviceProviderOptions);
            parser.validate(response, (err, profile, loggedOut) => {
                (0, chai_1.expect)(profile).to.be.an('object');
                (0, chai_1.expect)(err).to.be.null;
                (0, chai_1.expect)(loggedOut).to.be.false;
                const { globalSettings } = Utils_1.SAMLUtils;
                const fieldMap = {
                    username: {
                        fieldName: 'uid',
                        template: 'user-__uid__',
                    },
                    email: 'email',
                };
                globalSettings.userDataFieldMap = JSON.stringify(fieldMap);
                Utils_1.SAMLUtils.updateGlobalSettings(globalSettings);
                Utils_1.SAMLUtils.relayState = '[RelayState]';
                if (!(0, isTruthy_1.isTruthy)(profile)) {
                    throw new Error('Profile is null');
                }
                const userObject = Utils_1.SAMLUtils.mapProfileToUserObject(profile);
                (0, chai_1.expect)(userObject).to.be.an('object');
                (0, chai_1.expect)(userObject).to.have.property('samlLogin').that.is.an('object');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.provider').that.is.equal('[RelayState]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.idp').that.is.equal('[ISSUER]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.idpSession').that.is.equal('[SESSIONINDEX]');
                (0, chai_1.expect)(userObject).to.have.nested.property('samlLogin.nameID').that.is.equal('[NAMEID]');
                (0, chai_1.expect)(userObject).to.have.property('emailList').that.is.an('array').that.includes('user1@example.com');
                (0, chai_1.expect)(userObject).to.have.property('username').that.is.equal('user-1');
                const map = new Map();
                map.set('epa', 'group1');
            });
        });
    });
    describe('[Utils]', () => {
        it('should return correct validation action redirect path', () => {
            const credentialToken = Utils_1.SAMLUtils.generateUniqueID();
            (0, chai_1.expect)(Utils_1.SAMLUtils.getValidationActionRedirectPath(credentialToken)).to.be.equal(`saml/${credentialToken}?saml_idp_credentialToken=${credentialToken}`);
        });
    });
});
