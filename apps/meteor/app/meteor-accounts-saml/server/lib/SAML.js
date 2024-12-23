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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAML = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const ServiceProvider_1 = require("./ServiceProvider");
const Utils_1 = require("./Utils");
const arrayUtils_1 = require("../../../../lib/utils/arrayUtils");
const system_1 = require("../../../../server/lib/logger/system");
const addUserToRoom_1 = require("../../../lib/server/functions/addUserToRoom");
const createRoom_1 = require("../../../lib/server/functions/createRoom");
const getUsernameSuggestion_1 = require("../../../lib/server/functions/getUsernameSuggestion");
const saveUserIdentity_1 = require("../../../lib/server/functions/saveUserIdentity");
const server_1 = require("../../../settings/server");
const i18n_1 = require("../../../utils/lib/i18n");
const showErrorMessage = function (res, err) {
    res.writeHead(200, {
        'Content-Type': 'text/html',
    });
    const content = `<html><body><h2>Sorry, an annoying error occured</h2><div>${(0, string_helpers_1.escapeHTML)(err)}</div></body></html>`;
    res.end(content, 'utf-8');
};
class SAML {
    static processRequest(req, res, service, samlObject) {
        return __awaiter(this, void 0, void 0, function* () {
            // Skip everything if there's no service set by the saml middleware
            if (!service) {
                if (samlObject.actionName === 'metadata') {
                    showErrorMessage(res, `Unexpected SAML service ${samlObject.serviceName}`);
                    return;
                }
                throw new Error(`Unexpected SAML service ${samlObject.serviceName}`);
            }
            switch (samlObject.actionName) {
                case 'metadata':
                    return this.processMetadataAction(res, service);
                case 'logout':
                    return this.processLogoutAction(req, res, service);
                case 'sloRedirect':
                    return this.processSLORedirectAction(req, res);
                case 'authorize':
                    return this.processAuthorizeAction(req, res, service, samlObject);
                case 'validate':
                    return this.processValidateAction(req, res, service, samlObject);
                default:
                    throw new Error(`Unexpected SAML action ${samlObject.actionName}`);
            }
        });
    }
    static hasCredential(credentialToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.CredentialTokens.findOneNotExpiredById(credentialToken)) != null;
        });
    }
    static retrieveCredential(credentialToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // The credentialToken in all these functions corresponds to SAMLs inResponseTo field and is mandatory to check.
            const data = yield models_1.CredentialTokens.findOneNotExpiredById(credentialToken);
            if (data) {
                return data.userInfo;
            }
        });
    }
    static storeCredential(credentialToken, loginResult) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.CredentialTokens.create(credentialToken, loginResult);
        });
    }
    static insertOrUpdateSAMLUser(userObject) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { generateUsername, immutableProperty, nameOverwrite, mailOverwrite, channelsAttributeUpdate, defaultUserRole = 'user', } = Utils_1.SAMLUtils.globalSettings;
            let customIdentifierMatch = false;
            let customIdentifierAttributeName = null;
            let user = null;
            // First, try searching by custom identifier
            if (userObject.identifier.type === 'custom' &&
                userObject.identifier.attribute &&
                userObject.attributeList.has(userObject.identifier.attribute)) {
                customIdentifierAttributeName = userObject.identifier.attribute;
                const query = {};
                query[`services.saml.${customIdentifierAttributeName}`] = userObject.attributeList.get(customIdentifierAttributeName);
                user = yield models_1.Users.findOne(query);
                if (user) {
                    customIdentifierMatch = true;
                }
            }
            // Second, try searching by username or email (according to the immutableProperty setting)
            if (!user) {
                const expression = userObject.emailList.map((email) => `^${(0, string_helpers_1.escapeRegExp)(email)}$`).join('|');
                const emailRegex = new RegExp(expression, 'i');
                user = yield SAML.findUser(userObject.username, emailRegex);
            }
            const emails = userObject.emailList.map((email) => ({
                address: email,
                verified: server_1.settings.get('Accounts_Verify_Email_For_External_Accounts'),
            }));
            let { username } = userObject;
            const { fullName } = userObject;
            const active = !server_1.settings.get('Accounts_ManuallyApproveNewUsers');
            if (!user) {
                // If we received any role from the mapping, use them - otherwise use the default role for creation.
                const roles = ((_a = userObject.roles) === null || _a === void 0 ? void 0 : _a.length) ? userObject.roles : (0, arrayUtils_1.ensureArray)(defaultUserRole.split(','));
                const newUser = {
                    name: fullName,
                    active,
                    globalRoles: roles,
                    emails,
                    services: {
                        saml: {
                            provider: userObject.samlLogin.provider,
                            idp: userObject.samlLogin.idp,
                        },
                    },
                };
                if (customIdentifierAttributeName) {
                    newUser.services.saml[customIdentifierAttributeName] = userObject.attributeList.get(customIdentifierAttributeName);
                }
                if (generateUsername === true) {
                    username = yield (0, getUsernameSuggestion_1.generateUsernameSuggestion)(newUser);
                }
                if (username) {
                    newUser.username = username;
                    newUser.name = newUser.name || SAML.guessNameFromUsername(username);
                }
                if (userObject.language) {
                    if ((_b = i18n_1.i18n.languages) === null || _b === void 0 ? void 0 : _b.includes(userObject.language)) {
                        newUser.language = userObject.language;
                    }
                }
                const userId = yield accounts_base_1.Accounts.insertUserDoc({}, newUser);
                user = yield models_1.Users.findOneById(userId);
                if (user && userObject.channels && channelsAttributeUpdate !== true) {
                    yield SAML.subscribeToSAMLChannels(userObject.channels, user);
                }
            }
            if (!user) {
                throw new Error('Failed to create user');
            }
            // creating the token and adding to the user
            const stampedToken = accounts_base_1.Accounts._generateStampedLoginToken();
            yield models_1.Users.addPersonalAccessTokenToUser({
                userId: user._id,
                loginTokenObject: stampedToken,
            });
            const updateData = {
                'services.saml.provider': userObject.samlLogin.provider,
                'services.saml.idp': userObject.samlLogin.idp,
                'services.saml.idpSession': userObject.samlLogin.idpSession,
                'services.saml.nameID': userObject.samlLogin.nameID,
            };
            // If the user was not found through the customIdentifier property, then update it's value
            if (customIdentifierMatch === false && customIdentifierAttributeName) {
                updateData[`services.saml.${customIdentifierAttributeName}`] = userObject.attributeList.get(customIdentifierAttributeName);
            }
            // Overwrite mail if needed
            if (mailOverwrite === true && (customIdentifierMatch === true || immutableProperty !== 'EMail')) {
                updateData.emails = emails;
            }
            // When updating an user, we only update the roles if we received them from the mapping
            if ((_c = userObject.roles) === null || _c === void 0 ? void 0 : _c.length) {
                updateData.roles = userObject.roles;
            }
            if (userObject.channels && channelsAttributeUpdate === true) {
                yield SAML.subscribeToSAMLChannels(userObject.channels, user);
            }
            yield models_1.Users.updateOne({
                _id: user._id,
            }, {
                $set: updateData,
            });
            if ((username && username !== user.username) || (nameOverwrite && fullName && fullName !== user.name)) {
                yield (0, saveUserIdentity_1.saveUserIdentity)({ _id: user._id, name: nameOverwrite ? fullName || undefined : user.name, username });
            }
            // sending token along with the userId
            return {
                userId: user._id,
                token: stampedToken.token,
            };
        });
    }
    static processMetadataAction(res, service) {
        try {
            const serviceProvider = new ServiceProvider_1.SAMLServiceProvider(service);
            res.writeHead(200);
            res.write(serviceProvider.generateServiceProviderMetadata());
            res.end();
        }
        catch (err) {
            showErrorMessage(res, err);
        }
    }
    static processLogoutAction(req, res, service) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is where we receive SAML LogoutResponse
            if (req.query.SAMLRequest) {
                return this.processLogoutRequest(req, res, service);
            }
            return this.processLogoutResponse(req, res, service);
        });
    }
    static _logoutRemoveTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils_1.SAMLUtils.log(`Found user ${userId}`);
            yield models_1.Users.unsetLoginTokens(userId);
            yield models_1.Users.removeSamlServiceSession(userId);
        });
    }
    static processLogoutRequest(req, res, service) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceProvider = new ServiceProvider_1.SAMLServiceProvider(service);
            yield serviceProvider.validateLogoutRequest(req.query.SAMLRequest, (err, result) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    system_1.SystemLogger.error({ err });
                    throw new meteor_1.Meteor.Error('Unable to Validate Logout Request');
                }
                if (!(result === null || result === void 0 ? void 0 : result.nameID) || !(result === null || result === void 0 ? void 0 : result.idpSession)) {
                    throw new meteor_1.Meteor.Error('Unable to process Logout Request: missing request data.');
                }
                let timeoutHandler = undefined;
                const redirect = (url) => {
                    if (!timeoutHandler) {
                        // If the handler is null, then we already ended the response;
                        return;
                    }
                    clearTimeout(timeoutHandler);
                    timeoutHandler = undefined;
                    res.writeHead(302, {
                        Location: url || meteor_1.Meteor.absoluteUrl(),
                    });
                    res.end();
                };
                // Add a timeout to end the server response
                timeoutHandler = setTimeout(() => {
                    // If we couldn't get a valid IdP url, let's redirect the user to our home so the browser doesn't hang on them.
                    redirect();
                }, 5000);
                try {
                    const loggedOutUsers = yield models_1.Users.findBySAMLNameIdOrIdpSession(result.nameID, result.idpSession).toArray();
                    if (loggedOutUsers.length > 1) {
                        throw new meteor_1.Meteor.Error('Found multiple users matching SAML session');
                    }
                    if (loggedOutUsers.length === 0) {
                        throw new meteor_1.Meteor.Error('Invalid logout request: no user associated with session.');
                    }
                    yield this._logoutRemoveTokens(loggedOutUsers[0]._id);
                    const { response } = serviceProvider.generateLogoutResponse({
                        nameID: result.nameID || '',
                        sessionIndex: result.idpSession || '',
                        inResponseToId: result.id || '',
                    });
                    serviceProvider.logoutResponseToUrl(response, (err, url) => {
                        if (err) {
                            system_1.SystemLogger.error({ err });
                            return redirect();
                        }
                        redirect(url);
                    });
                }
                catch (e) {
                    system_1.SystemLogger.error(e);
                    redirect();
                }
            }));
        });
    }
    static processLogoutResponse(req, res, service) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.SAMLResponse) {
                Utils_1.SAMLUtils.error('Invalid LogoutResponse, missing SAMLResponse', req.query);
                throw new Error('Invalid LogoutResponse received.');
            }
            const serviceProvider = new ServiceProvider_1.SAMLServiceProvider(service);
            yield serviceProvider.validateLogoutResponse(req.query.SAMLResponse, (err, inResponseTo) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return;
                }
                if (!inResponseTo) {
                    throw new meteor_1.Meteor.Error('Invalid logout request: no inResponseTo value.');
                }
                const logOutUser = (inResponseTo) => __awaiter(this, void 0, void 0, function* () {
                    Utils_1.SAMLUtils.log(`Logging Out user via inResponseTo ${inResponseTo}`);
                    const loggedOutUsers = yield models_1.Users.findBySAMLInResponseTo(inResponseTo).toArray();
                    if (loggedOutUsers.length > 1) {
                        throw new meteor_1.Meteor.Error('Found multiple users matching SAML inResponseTo fields');
                    }
                    if (loggedOutUsers.length === 0) {
                        throw new meteor_1.Meteor.Error('Invalid logout request: no user associated with inResponseTo.');
                    }
                    yield this._logoutRemoveTokens(loggedOutUsers[0]._id);
                });
                try {
                    yield logOutUser(inResponseTo);
                }
                finally {
                    res.writeHead(302, {
                        Location: req.query.RelayState,
                    });
                    res.end();
                }
            }));
        });
    }
    static processSLORedirectAction(req, res) {
        res.writeHead(302, {
            // credentialToken here is the SAML LogOut Request that we'll send back to IDP
            Location: req.query.redirect,
        });
        res.end();
    }
    static processAuthorizeAction(req, res, service, samlObject) {
        return __awaiter(this, void 0, void 0, function* () {
            service.id = samlObject.credentialToken;
            // Allow redirecting to internal domains when login process is complete
            const { referer } = req.headers;
            const siteUrl = server_1.settings.get('Site_Url');
            if (typeof referer === 'string' && referer.startsWith(siteUrl)) {
                service.redirectUrl = referer;
            }
            const serviceProvider = new ServiceProvider_1.SAMLServiceProvider(service);
            let url;
            try {
                url = yield serviceProvider.getAuthorizeUrl();
            }
            catch (err) {
                Utils_1.SAMLUtils.error('Unable to generate authorize url');
                Utils_1.SAMLUtils.error(err);
                url = meteor_1.Meteor.absoluteUrl();
            }
            res.writeHead(302, {
                Location: url,
            });
            res.end();
        });
    }
    static processValidateAction(req, res, service, _samlObject) {
        const serviceProvider = new ServiceProvider_1.SAMLServiceProvider(service);
        Utils_1.SAMLUtils.relayState = req.body.RelayState;
        serviceProvider.validateResponse(req.body.SAMLResponse, (err, profile /* , loggedOut*/) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    Utils_1.SAMLUtils.error(err);
                    throw new Error('Unable to validate response url');
                }
                if (!profile) {
                    throw new Error('No user data collected from IdP response.');
                }
                // create a random token to store the login result
                // to test an IdP initiated login on localhost, use the following URL (assuming SimpleSAMLPHP on localhost:8080):
                // http://localhost:8080/simplesaml/saml2/idp/SSOService.php?spentityid=http://localhost:3000/_saml/metadata/test-sp
                const credentialToken = random_1.Random.id();
                const loginResult = {
                    profile,
                };
                yield this.storeCredential(credentialToken, loginResult);
                const url = meteor_1.Meteor.absoluteUrl(Utils_1.SAMLUtils.getValidationActionRedirectPath(credentialToken, service.redirectUrl));
                res.writeHead(302, {
                    Location: url,
                });
                res.end();
            }
            catch (error) {
                Utils_1.SAMLUtils.error(error);
                res.writeHead(302, {
                    Location: meteor_1.Meteor.absoluteUrl(),
                });
                res.end();
            }
        }));
    }
    static findUser(username, emailRegex) {
        return __awaiter(this, void 0, void 0, function* () {
            const { globalSettings } = Utils_1.SAMLUtils;
            if (globalSettings.immutableProperty === 'Username') {
                if (username) {
                    return models_1.Users.findOne({
                        username,
                    });
                }
                return;
            }
            return models_1.Users.findOne({
                'emails.address': emailRegex,
            });
        });
    }
    static guessNameFromUsername(username) {
        return username
            .replace(/\W/g, ' ')
            .replace(/\s(.)/g, (u) => u.toUpperCase())
            .replace(/^(.)/, (u) => u.toLowerCase())
            .replace(/^\w/, (u) => u.toUpperCase());
    }
    static subscribeToSAMLChannels(channels, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, channels_1, channels_1_1;
            var _b, e_1, _c, _d;
            const { includePrivateChannelsInUpdate } = Utils_1.SAMLUtils.globalSettings;
            try {
                try {
                    for (_a = true, channels_1 = __asyncValues(channels); channels_1_1 = yield channels_1.next(), _b = channels_1_1.done, !_b; _a = true) {
                        _d = channels_1_1.value;
                        _a = false;
                        let roomName = _d;
                        roomName = roomName.trim();
                        if (!roomName) {
                            continue;
                        }
                        const privRoom = yield models_1.Rooms.findOneByNameAndType(roomName, 'p', {});
                        if (privRoom && includePrivateChannelsInUpdate === true) {
                            yield (0, addUserToRoom_1.addUserToRoom)(privRoom._id, user);
                            continue;
                        }
                        const room = yield models_1.Rooms.findOneByNameAndType(roomName, 'c', {});
                        if (room) {
                            yield (0, addUserToRoom_1.addUserToRoom)(room._id, user);
                            continue;
                        }
                        if (!room && !privRoom) {
                            // If the user doesn't have an username yet, we can't create new rooms for them
                            if (user.username) {
                                yield (0, createRoom_1.createRoom)('c', roomName, user);
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = channels_1.return)) yield _c.call(channels_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (err) {
                system_1.SystemLogger.error(err);
            }
        });
    }
}
exports.SAML = SAML;
