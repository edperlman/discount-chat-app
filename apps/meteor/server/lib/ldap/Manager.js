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
exports.LDAPManager = void 0;
const models_1 = require("@rocket.chat/models");
const sha256_1 = require("@rocket.chat/sha256");
const ldap_escape_1 = __importDefault(require("ldap-escape"));
const limax_1 = __importDefault(require("limax"));
// #ToDo: #TODO: Remove Meteor dependencies
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const Connection_1 = require("./Connection");
const Logger_1 = require("./Logger");
const UserConverter_1 = require("./UserConverter");
const getLDAPConditionalSetting_1 = require("./getLDAPConditionalSetting");
const setUserAvatar_1 = require("../../../app/lib/server/functions/setUserAvatar");
const server_1 = require("../../../app/settings/server");
const callbacks_1 = require("../../../lib/callbacks");
const omit_1 = require("../../../lib/utils/omit");
class LDAPManager {
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug({ msg: 'Init LDAP login', username });
            if (server_1.settings.get('LDAP_Enable') !== true) {
                return this.fallbackToDefaultLogin(username, password);
            }
            let ldapUser;
            const ldap = new Connection_1.LDAPConnection();
            try {
                try {
                    yield ldap.connect();
                    ldapUser = yield this.findUser(ldap, username, password);
                }
                catch (error) {
                    Logger_1.logger.error(error);
                }
                if (ldapUser === undefined) {
                    return this.fallbackToDefaultLogin(username, password);
                }
                const slugifiedUsername = this.slugifyUsername(ldapUser, username);
                const user = yield this.findExistingUser(ldapUser, slugifiedUsername);
                // Bind connection to the admin user so that RC has full access to groups in the next steps
                yield ldap.bindAuthenticationUser();
                if (user) {
                    return yield this.loginExistingUser(ldap, user, ldapUser, password);
                }
                return yield this.loginNewUserFromLDAP(slugifiedUsername, ldap, ldapUser, password);
            }
            finally {
                ldap.disconnect();
            }
        });
    }
    static loginAuthenticatedUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug({ msg: 'Init LDAP login', username });
            if (server_1.settings.get('LDAP_Enable') !== true) {
                return;
            }
            let ldapUser;
            const ldap = new Connection_1.LDAPConnection();
            try {
                try {
                    yield ldap.connect();
                    ldapUser = yield this.findAuthenticatedUser(ldap, username);
                }
                catch (error) {
                    Logger_1.logger.error(error);
                }
                if (ldapUser === undefined) {
                    return;
                }
                const slugifiedUsername = this.slugifyUsername(ldapUser, username);
                const user = yield this.findExistingUser(ldapUser, slugifiedUsername);
                if (user) {
                    return yield this.loginExistingUser(ldap, user, ldapUser);
                }
                return yield this.loginNewUserFromLDAP(slugifiedUsername, ldap, ldapUser);
            }
            finally {
                ldap.disconnect();
            }
        });
    }
    static testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ldap = new Connection_1.LDAPConnection();
                yield ldap.testConnection();
            }
            catch (error) {
                Logger_1.connLogger.error(error);
                throw error;
            }
        });
    }
    static testSearch(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const escapedUsername = ldap_escape_1.default.filter `${username}`;
            const ldap = new Connection_1.LDAPConnection();
            try {
                yield ldap.connect();
                const users = yield ldap.searchByUsername(escapedUsername);
                if (users.length !== 1) {
                    Logger_1.logger.debug(`Search returned ${users.length} records for ${escapedUsername}`);
                    throw new Error('User not found');
                }
            }
            catch (error) {
                Logger_1.logger.error(error);
                throw error;
            }
        });
    }
    static syncUserAvatar(user, ldapUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user._id) || server_1.settings.get('LDAP_Sync_User_Avatar') !== true) {
                return;
            }
            const avatar = this.getAvatarFromUser(ldapUser);
            if (!avatar) {
                return;
            }
            const hash = (0, sha256_1.SHA256)(avatar.toString());
            if (user.avatarETag === hash) {
                return;
            }
            Logger_1.logger.debug({ msg: 'Syncing user avatar', username: user.username });
            yield (0, setUserAvatar_1.setUserAvatar)(user, avatar, 'image/jpeg', 'rest', hash);
        });
    }
    // This method will only find existing users that are already linked to LDAP
    static findExistingLDAPUser(ldapUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueIdentifierField = this.getLdapUserUniqueID(ldapUser);
            if (uniqueIdentifierField) {
                Logger_1.logger.debug({ msg: 'Querying user', uniqueId: uniqueIdentifierField.value });
                return models_1.Users.findOneByLDAPId(uniqueIdentifierField.value, uniqueIdentifierField.attribute);
            }
        });
    }
    static getConverterOptions() {
        var _a;
        return {
            flagEmailsAsVerified: (_a = server_1.settings.get('Accounts_Verify_Email_For_External_Accounts')) !== null && _a !== void 0 ? _a : false,
            skipExistingUsers: false,
            skipUserCallbacks: false,
        };
    }
    static mapUserData(ldapUser, usedUsername) {
        const uniqueId = this.getLdapUserUniqueID(ldapUser);
        if (!uniqueId) {
            throw new Error('Failed to generate unique identifier for ldap entry');
        }
        const { attribute: idAttribute, value: id } = uniqueId;
        const username = this.slugifyUsername(ldapUser, usedUsername || id || '') || undefined;
        const emails = this.getLdapEmails(ldapUser, username).map((email) => email.trim());
        const name = this.getLdapName(ldapUser) || undefined;
        const voipExtension = this.getLdapExtension(ldapUser);
        const userData = {
            type: 'user',
            emails,
            importIds: [ldapUser.dn],
            username,
            name,
            voipExtension,
            services: {
                ldap: {
                    idAttribute,
                    id,
                },
            },
        };
        this.onMapUserData(ldapUser, userData);
        return userData;
    }
    static onMapUserData(ldapUser, userData) {
        void callbacks_1.callbacks.run('mapLDAPUserData', userData, ldapUser);
    }
    static findUser(ldap, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const escapedUsername = ldap_escape_1.default.filter `${username}`;
            try {
                const users = yield ldap.searchByUsername(escapedUsername);
                if (users.length !== 1) {
                    Logger_1.logger.debug(`Search returned ${users.length} records for ${escapedUsername}`);
                    throw new Error('User not found');
                }
                const [ldapUser] = users;
                if (!(yield ldap.isUserAcceptedByGroupFilter(escapedUsername, ldapUser.dn))) {
                    throw new Error('User not found');
                }
                if (!(yield ldap.authenticate(ldapUser.dn, password))) {
                    Logger_1.logger.debug(`Wrong password for ${escapedUsername}`);
                    throw new Error('Invalid user or wrong password');
                }
                if (server_1.settings.get('LDAP_Find_User_After_Login')) {
                    // Do a search as the user and check if they have any result
                    Logger_1.authLogger.debug('User authenticated successfully, performing additional search.');
                    if ((yield ldap.searchAndCount(ldapUser.dn, {})) === 0) {
                        Logger_1.authLogger.debug(`Bind successful but user ${ldapUser.dn} was not found via search`);
                    }
                }
                return ldapUser;
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
        });
    }
    static findAuthenticatedUser(ldap, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const escapedUsername = ldap_escape_1.default.filter `${username}`;
            try {
                const users = yield ldap.searchByUsername(escapedUsername);
                if (users.length !== 1) {
                    Logger_1.logger.debug(`Search returned ${users.length} records for ${escapedUsername}`);
                    return;
                }
                const [ldapUser] = users;
                if (server_1.settings.get('LDAP_Find_User_After_Login')) {
                    // Do a search as the user and check if they have any result
                    Logger_1.authLogger.debug('User authenticated successfully, performing additional search.');
                    if ((yield ldap.searchAndCount(ldapUser.dn, {})) === 0) {
                        Logger_1.authLogger.debug(`Bind successful but user ${ldapUser.dn} was not found via search`);
                    }
                }
                if (!(yield ldap.isUserAcceptedByGroupFilter(escapedUsername, ldapUser.dn))) {
                    throw new Error('User not in a valid group');
                }
                return ldapUser;
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
        });
    }
    static loginNewUserFromLDAP(slugifiedUsername, ldap, ldapUser, ldapPass) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug({ msg: 'User does not exist, creating', username: slugifiedUsername });
            let username;
            if ((0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_Username_Field') !== '') {
                username = slugifiedUsername;
            }
            // Create new user
            return this.addLdapUser(ldapUser, username, ldapPass, ldap);
        });
    }
    static addLdapUser(ldapUser, username, password, ldap) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.syncUserForLogin(ldapUser, undefined, username);
            if (!user) {
                return;
            }
            yield this.onLogin(ldapUser, user, password, ldap, true);
            return {
                userId: user._id,
            };
        });
    }
    static onLogin(ldapUser, user, password, ldap, isNewUser) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug('running onLDAPLogin');
            if (server_1.settings.get('LDAP_Login_Fallback') && typeof password === 'string' && password.trim() !== '') {
                yield accounts_base_1.Accounts.setPasswordAsync(user._id, password, { logout: false });
            }
            yield this.syncUserAvatar(user, ldapUser);
            yield callbacks_1.callbacks.run('onLDAPLogin', { user, ldapUser, isNewUser }, ldap);
        });
    }
    static loginExistingUser(ldap, user, ldapUser, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (user.ldap !== true && server_1.settings.get('LDAP_Merge_Existing_Users') !== true) {
                Logger_1.logger.debug('User exists without "ldap: true"');
                throw new meteor_1.Meteor.Error('LDAP-login-error', `LDAP Authentication succeeded, but there's already an existing user with provided username [${user.username}] in Mongo.`);
            }
            // If we're merging an ldap user with a local user, then we need to sync the data even if 'update data on login' is off.
            const forceUserSync = !user.ldap;
            const syncData = forceUserSync || ((_a = server_1.settings.get('LDAP_Update_Data_On_Login')) !== null && _a !== void 0 ? _a : true);
            Logger_1.logger.debug({ msg: 'Logging user in', syncData });
            const updatedUser = (syncData && (yield this.syncUserForLogin(ldapUser, user))) || user;
            yield this.onLogin(ldapUser, updatedUser, password, ldap, false);
            return {
                userId: user._id,
            };
        });
    }
    static syncUserForLogin(ldapUser, existingUser, usedUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug({
                msg: 'Syncing user data',
                ldapUser: (0, omit_1.omit)(ldapUser, '_raw'),
                user: Object.assign({}, (existingUser && { email: existingUser.emails, _id: existingUser._id })),
            });
            const userData = this.mapUserData(ldapUser, usedUsername);
            // make sure to persist existing user data when passing to sync/convert
            // TODO this is only needed because ImporterDataConverter assigns a default role and type if nothing is set. we might need to figure out a better way and stop doing that there
            if (existingUser) {
                if (!userData.roles && existingUser.roles) {
                    userData.roles = existingUser.roles;
                }
                if (!userData.type && existingUser.type) {
                    userData.type = existingUser.type;
                }
            }
            const options = this.getConverterOptions();
            yield UserConverter_1.LDAPUserConverter.convertSingleUser(userData, options);
            return existingUser || this.findExistingLDAPUser(ldapUser);
        });
    }
    static getLdapUserUniqueID(ldapUser) {
        let uniqueIdentifierField = server_1.settings.get('LDAP_Unique_Identifier_Field');
        if (uniqueIdentifierField) {
            uniqueIdentifierField = uniqueIdentifierField.replace(/\s/g, '').split(',');
        }
        else {
            uniqueIdentifierField = [];
        }
        let userSearchField = (0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_User_Search_Field');
        if (userSearchField) {
            userSearchField = userSearchField.replace(/\s/g, '').split(',');
        }
        else {
            userSearchField = [];
        }
        uniqueIdentifierField = uniqueIdentifierField.concat(userSearchField);
        if (!uniqueIdentifierField.length) {
            uniqueIdentifierField.push('dn');
        }
        const key = uniqueIdentifierField.find((field) => !underscore_1.default.isEmpty(ldapUser._raw[field]));
        if (key) {
            return {
                attribute: key,
                value: ldapUser._raw[key].toString('hex'),
            };
        }
        Logger_1.connLogger.warn('Failed to generate unique identifier for ldap entry');
        Logger_1.connLogger.debug(ldapUser);
    }
    static ldapKeyExists(ldapUser, key) {
        return !underscore_1.default.isEmpty(ldapUser[key.trim()]);
    }
    static getLdapString(ldapUser, key) {
        return ldapUser[key.trim()];
    }
    static getLdapDynamicValue(ldapUser, attributeSetting) {
        if (!attributeSetting) {
            return;
        }
        // If the attribute setting is a template, then convert the variables in it
        if (attributeSetting.includes('#{')) {
            return attributeSetting.replace(/#{(.+?)}/g, (_match, field) => {
                const key = field.trim();
                if (this.ldapKeyExists(ldapUser, key)) {
                    return this.getLdapString(ldapUser, key);
                }
                return '';
            });
        }
        // If it's not a template, then treat the setting as a CSV list of possible attribute names and return the first valid one.
        const attributeList = attributeSetting.replace(/\s/g, '').split(',');
        const key = attributeList.find((field) => this.ldapKeyExists(ldapUser, field));
        if (key) {
            return this.getLdapString(ldapUser, key);
        }
    }
    static getLdapName(ldapUser) {
        const nameAttributes = (0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_Name_Field');
        return this.getLdapDynamicValue(ldapUser, nameAttributes);
    }
    static getLdapExtension(ldapUser) {
        const extensionAttribute = server_1.settings.get('LDAP_Extension_Field');
        if (!extensionAttribute) {
            return;
        }
        return this.getLdapString(ldapUser, extensionAttribute);
    }
    static getLdapEmails(ldapUser, username) {
        var _a;
        const emailAttributes = (0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_Email_Field');
        if (emailAttributes) {
            const attributeList = emailAttributes.replace(/\s/g, '').split(',');
            const key = attributeList.find((field) => this.ldapKeyExists(ldapUser, field));
            const emails = [].concat(key ? ldapUser[key.trim()] : []);
            const filteredEmails = emails.filter((email) => email.includes('@'));
            if (filteredEmails.length) {
                return filteredEmails;
            }
        }
        if (server_1.settings.get('LDAP_Default_Domain') !== '' && username) {
            return [`${username}@${server_1.settings.get('LDAP_Default_Domain')}`];
        }
        if ((_a = ldapUser.mail) === null || _a === void 0 ? void 0 : _a.includes('@')) {
            return [ldapUser.mail];
        }
        Logger_1.logger.debug(ldapUser);
        throw new Error('Failed to get email address from LDAP user');
    }
    static slugify(text) {
        if (server_1.settings.get('UTF8_Names_Slugify') !== true) {
            return text;
        }
        text = (0, limax_1.default)(text, { replacement: '.' });
        return text.replace(/[^0-9a-z-_.]/g, '');
    }
    static slugifyUsername(ldapUser, requestUsername) {
        if ((0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_Username_Field') !== '') {
            const username = this.getLdapUsername(ldapUser);
            if (username) {
                return this.slugify(username);
            }
        }
        return this.slugify(requestUsername);
    }
    static getLdapUsername(ldapUser) {
        const usernameField = (0, getLDAPConditionalSetting_1.getLDAPConditionalSetting)('LDAP_Username_Field');
        return this.getLdapDynamicValue(ldapUser, usernameField);
    }
    // This method will find existing users by LDAP id or by username.
    static findExistingUser(ldapUser, slugifiedUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findExistingLDAPUser(ldapUser);
            if (user) {
                return user;
            }
            // If we don't have that ldap user linked yet, check if there's any non-ldap user with the same username
            return models_1.Users.findOneWithoutLDAPByUsernameIgnoringCase(slugifiedUsername);
        });
    }
    static fallbackToDefaultLogin(username, password) {
        if (typeof username === 'string') {
            if (username.indexOf('@') === -1) {
                username = { username };
            }
            else {
                username = { email: username };
            }
        }
        Logger_1.logger.debug({ msg: 'Fallback to default account system', username });
        const loginRequest = {
            user: username,
            password: {
                digest: (0, sha256_1.SHA256)(password),
                algorithm: 'sha-256',
            },
        };
        return accounts_base_1.Accounts._runLoginHandlers(this, loginRequest);
    }
    static getAvatarFromUser(ldapUser) {
        const avatarField = String(server_1.settings.get('LDAP_Avatar_Field') || '').trim();
        if (avatarField && ldapUser._raw[avatarField]) {
            return ldapUser._raw[avatarField];
        }
        if (ldapUser._raw.thumbnailPhoto) {
            return ldapUser._raw.thumbnailPhoto;
        }
        if (ldapUser._raw.jpegPhoto) {
            return ldapUser._raw.jpegPhoto;
        }
    }
}
exports.LDAPManager = LDAPManager;
