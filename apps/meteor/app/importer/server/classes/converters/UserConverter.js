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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConverter = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const sha256_1 = require("@rocket.chat/sha256");
const bcrypt_1 = require("bcrypt");
const accounts_base_1 = require("meteor/accounts-base");
const RecordConverter_1 = require("./RecordConverter");
const generateTempPassword_1 = require("./generateTempPassword");
const callbacks_1 = require("../../../../../lib/callbacks");
const addUserToDefaultChannels_1 = require("../../../../lib/server/functions/addUserToDefaultChannels");
const getUsernameSuggestion_1 = require("../../../../lib/server/functions/getUsernameSuggestion");
const saveUserIdentity_1 = require("../../../../lib/server/functions/saveUserIdentity");
const setUserActiveStatus_1 = require("../../../../lib/server/functions/setUserActiveStatus");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
class UserConverter extends RecordConverter_1.RecordConverter {
    constructor() {
        super(...arguments);
        this.insertedIds = new Set();
        this.updatedIds = new Set();
    }
    convertRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, _id } = record;
            data.importIds = data.importIds.filter((item) => item);
            if (!data.emails.length && !data.username) {
                throw new Error('importer-user-missing-email-and-username');
            }
            const existingUser = yield this.findExistingUser(data);
            if (existingUser && this._options.skipExistingUsers) {
                yield this.skipRecord(_id);
                return;
            }
            if (!existingUser && this._options.skipNewUsers) {
                yield this.skipRecord(_id);
                return;
            }
            yield this.insertOrUpdateUser(existingUser, data);
            return !existingUser;
        });
    }
    convertData() {
        const _super = Object.create(null, {
            convertData: { get: () => super.convertData }
        });
        return __awaiter(this, arguments, void 0, function* (userCallbacks = {}) {
            this.insertedIds.clear();
            this.updatedIds.clear();
            if (this._options.quickUserInsertion) {
                yield this.batchConversion(userCallbacks);
            }
            else {
                yield _super.convertData.call(this, userCallbacks);
            }
            yield callbacks_1.callbacks.run('afterUserImport', {
                inserted: [...this.insertedIds],
                updated: [...this.updatedIds],
                skipped: this.skippedCount,
                failed: this.failedCount,
            });
        });
    }
    batchConversion() {
        return __awaiter(this, arguments, void 0, function* (_a = {}) {
            var { afterBatchFn } = _a, callbacks = __rest(_a, ["afterBatchFn"]);
            const batchToInsert = new Set();
            yield this.iterateRecords(Object.assign(Object.assign({}, callbacks), { processRecord: (record) => __awaiter(this, void 0, void 0, function* () {
                    const { data } = record;
                    data.importIds = data.importIds.filter((item) => item);
                    if (!data.emails.length && !data.username) {
                        throw new Error('importer-user-missing-email-and-username');
                    }
                    batchToInsert.add(data);
                    if (batchToInsert.size >= 50) {
                        const usersToInsert = yield this.buildUserBatch([...batchToInsert]);
                        batchToInsert.clear();
                        const newIds = yield this.insertUserBatch(usersToInsert, { afterBatchFn });
                        newIds.forEach((id) => this.insertedIds.add(id));
                    }
                    return undefined;
                }) }));
            if (batchToInsert.size > 0) {
                const usersToInsert = yield this.buildUserBatch([...batchToInsert]);
                const newIds = yield this.insertUserBatch(usersToInsert, { afterBatchFn });
                newIds.forEach((id) => this.insertedIds.add(id));
            }
        });
    }
    insertUserBatch(users_1, _a) {
        return __awaiter(this, arguments, void 0, function* (users, { afterBatchFn }) {
            var _b, _c, _d, _e;
            let newIds = null;
            try {
                newIds = Object.values((yield models_1.Users.insertMany(users, { ordered: false })).insertedIds);
                if (afterBatchFn) {
                    yield afterBatchFn(newIds.length, 0);
                }
            }
            catch (e) {
                newIds = (((_c = (_b = e.result) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.insertedIds) || []);
                const errorCount = users.length - (((_e = (_d = e.result) === null || _d === void 0 ? void 0 : _d.result) === null || _e === void 0 ? void 0 : _e.nInserted) || 0);
                if (afterBatchFn) {
                    yield afterBatchFn(Math.min(newIds.length, users.length - errorCount), errorCount);
                }
            }
            return newIds;
        });
    }
    findExistingUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.emails.length) {
                const emailUser = yield models_1.Users.findOneByEmailAddress(data.emails[0], {});
                if (emailUser) {
                    return emailUser;
                }
            }
            // If we couldn't find one by their email address, try to find an existing user by their username
            if (data.username) {
                return models_1.Users.findOneByUsernameIgnoringCase(data.username, {});
            }
        });
    }
    addUserImportId(updateData, userData) {
        var _a;
        if ((_a = userData.importIds) === null || _a === void 0 ? void 0 : _a.length) {
            updateData.$addToSet = {
                importIds: {
                    $each: userData.importIds,
                },
            };
        }
    }
    addUserEmails(updateData, userData, existingEmails) {
        var _a, _b;
        if (!((_a = userData.emails) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        const verifyEmails = Boolean(this._options.flagEmailsAsVerified);
        const newEmailList = [];
        for (const email of userData.emails) {
            const verified = verifyEmails || ((_b = existingEmails.find((ee) => ee.address === email)) === null || _b === void 0 ? void 0 : _b.verified) || false;
            newEmailList.push({
                address: email,
                verified,
            });
        }
        updateData.$set.emails = newEmailList;
    }
    addUserServices(updateData, userData) {
        if (!userData.services) {
            return;
        }
        for (const serviceKey in userData.services) {
            if (!userData.services[serviceKey]) {
                continue;
            }
            const service = userData.services[serviceKey];
            for (const key in service) {
                if (!service[key]) {
                    continue;
                }
                updateData.$set[`services.${serviceKey}.${key}`] = service[key];
            }
        }
    }
    addCustomFields(updateData, userData) {
        if (!userData.customFields) {
            return;
        }
        const subset = (source, currentPath) => {
            for (const key in source) {
                if (!source.hasOwnProperty(key)) {
                    continue;
                }
                const keyPath = `${currentPath}.${key}`;
                if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    subset(source[key], keyPath);
                    continue;
                }
                updateData.$set = Object.assign(Object.assign({}, updateData.$set), { [keyPath]: source[key] });
            }
        };
        subset(userData.customFields, 'customFields');
    }
    insertOrUpdateUser(existingUser, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.username && !(existingUser === null || existingUser === void 0 ? void 0 : existingUser.username)) {
                const emails = data.emails.filter(Boolean).map((email) => ({ address: email }));
                data.username = yield (0, getUsernameSuggestion_1.generateUsernameSuggestion)({
                    name: data.name,
                    emails,
                });
            }
            if (existingUser) {
                yield this.updateUser(existingUser, data);
                this.updatedIds.add(existingUser._id);
            }
            else {
                if (!data.name && data.username) {
                    data.name = this.guessNameFromUsername(data.username);
                }
                const userId = yield this.insertUser(data);
                data._id = userId;
                this.insertedIds.add(userId);
                if (!this._options.skipDefaultChannels) {
                    const insertedUser = yield models_1.Users.findOneById(userId, {});
                    if (!insertedUser) {
                        throw new Error(`User not found: ${userId}`);
                    }
                    yield (0, addUserToDefaultChannels_1.addUserToDefaultChannels)(insertedUser, true);
                }
            }
        });
    }
    updateUser(existingUser, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { _id } = existingUser;
            if (!_id) {
                return;
            }
            userData._id = _id;
            if (!userData.roles && !existingUser.roles) {
                userData.roles = ['user'];
            }
            if (!userData.type && !existingUser.type) {
                userData.type = 'user';
            }
            const updateData = Object.assign(Object.create(null), {
                $set: Object.assign(Object.create(null), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (userData.roles && { roles: userData.roles })), (userData.type && { type: userData.type })), (userData.statusText && { statusText: userData.statusText })), (userData.bio && { bio: userData.bio })), (((_a = userData.services) === null || _a === void 0 ? void 0 : _a.ldap) && { ldap: true })), (userData.avatarUrl && { _pendingAvatarUrl: userData.avatarUrl }))),
            });
            this.addCustomFields(updateData, userData);
            this.addUserServices(updateData, userData);
            this.addUserImportId(updateData, userData);
            this.addUserEmails(updateData, userData, existingUser.emails || []);
            if (Object.keys(updateData.$set).length === 0) {
                delete updateData.$set;
            }
            if (Object.keys(updateData).length > 0) {
                yield models_1.Users.updateOne({ _id }, updateData);
            }
            if (userData.utcOffset) {
                yield models_1.Users.setUtcOffset(_id, userData.utcOffset);
            }
            if (userData.name || userData.username) {
                yield (0, saveUserIdentity_1.saveUserIdentity)({ _id, name: userData.name, username: userData.username });
            }
            if (userData.importIds.length) {
                this._cache.addUser(userData.importIds[0], existingUser._id, existingUser.username || userData.username);
            }
            // Deleted users are 'inactive' users in Rocket.Chat
            if (userData.deleted && (existingUser === null || existingUser === void 0 ? void 0 : existingUser.active)) {
                yield (0, setUserActiveStatus_1.setUserActiveStatus)(_id, false, true);
            }
            else if (userData.deleted === false && (existingUser === null || existingUser === void 0 ? void 0 : existingUser.active) === false) {
                yield (0, setUserActiveStatus_1.setUserActiveStatus)(_id, true);
            }
            void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: _id, diff: updateData.$set });
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bcrypt_1.hash)((0, sha256_1.SHA256)(password), accounts_base_1.Accounts._bcryptRounds());
        });
    }
    generateTempPassword(userData) {
        return (0, generateTempPassword_1.generateTempPassword)(userData);
    }
    buildNewUserObject(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: userData.type || 'user' }, (userData.username && { username: userData.username })), (userData.emails.length && {
                emails: userData.emails.map((email) => ({ address: email, verified: !!this._options.flagEmailsAsVerified })),
            })), (userData.statusText && { statusText: userData.statusText })), (userData.name && { name: userData.name })), (userData.bio && { bio: userData.bio })), (userData.avatarUrl && { _pendingAvatarUrl: userData.avatarUrl })), (userData.utcOffset !== undefined && { utcOffset: userData.utcOffset })), {
                services: Object.assign(Object.assign({}, ((!!userData.password || !userData.services || !Object.keys(userData.services).length) && {
                    password: { bcrypt: yield this.hashPassword(userData.password || this.generateTempPassword(userData)) },
                })), (userData.services || {})),
            }), (((_a = userData.services) === null || _a === void 0 ? void 0 : _a.ldap) && { ldap: true })), (((_b = userData.importIds) === null || _b === void 0 ? void 0 : _b.length) && { importIds: userData.importIds })), (!!userData.customFields && { customFields: userData.customFields })), (userData.deleted !== undefined && { active: !userData.deleted })), (userData.voipExtension !== undefined && { freeSwitchExtension: userData.voipExtension }));
        });
    }
    buildUserBatch(usersData) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(usersData.map((userData) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const user = yield this.buildNewUserObject(userData);
                return Object.assign(Object.assign({ createdAt: new Date(), _id: random_1.Random.id(), status: 'offline' }, user), { roles: ((_a = userData.roles) === null || _a === void 0 ? void 0 : _a.length) ? userData.roles : ['user'], active: !userData.deleted, services: Object.assign(Object.assign({}, user.services), (this._options.enableEmail2fa
                        ? {
                            email2fa: {
                                enabled: true,
                                changedAt: new Date(),
                            },
                        }
                        : {})) });
            })));
        });
    }
    insertUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.buildNewUserObject(userData);
            return accounts_base_1.Accounts.insertUserDoc({
                joinDefaultChannels: false,
                skipEmailValidation: true,
                skipAdminCheck: true,
                skipAdminEmail: true,
                skipOnCreateUserCallback: this._options.skipUserCallbacks,
                skipBeforeCreateUserCallback: this._options.skipUserCallbacks,
                skipAfterCreateUserCallback: this._options.skipUserCallbacks,
                skipDefaultAvatar: true,
                skipAppsEngineEvent: !!process.env.IMPORTER_SKIP_APPS_EVENT,
            }, Object.assign(Object.assign({}, user), (((_a = userData.roles) === null || _a === void 0 ? void 0 : _a.length) ? { globalRoles: userData.roles } : {})));
        });
    }
    guessNameFromUsername(username) {
        return username
            .replace(/\W/g, ' ')
            .replace(/\s(.)/g, (u) => u.toUpperCase())
            .replace(/^(.)/, (u) => u.toLowerCase())
            .replace(/^\w/, (u) => u.toUpperCase());
    }
    getDataType() {
        return 'user';
    }
}
exports.UserConverter = UserConverter;
