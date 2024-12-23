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
exports.loginHandlerCAS = void 0;
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const accounts_base_1 = require("meteor/accounts-base");
const createNewUser_1 = require("./createNewUser");
const findExistingCASUser_1 = require("./findExistingCASUser");
const logger_1 = require("./logger");
const setRealName_1 = require("../../../app/lib/server/functions/setRealName");
const server_1 = require("../../../app/settings/server");
const loginHandlerCAS = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
    var _k;
    if (!options.cas) {
        return undefined;
    }
    // TODO: Sync wrapper due to the chain conversion to async models
    const credentials = yield models_1.CredentialTokens.findOneNotExpiredById(options.cas.credentialToken);
    if (credentials === undefined || credentials === null) {
        throw new Meteor.Error(accounts_base_1.Accounts.LoginCancelledError.numericError, 'no matching login attempt found');
    }
    const result = credentials.userInfo;
    const syncUserDataFieldMap = server_1.settings.get('CAS_Sync_User_Data_FieldMap').trim();
    const casVersion = parseFloat((_k = server_1.settings.get('CAS_version')) !== null && _k !== void 0 ? _k : '1.0');
    const syncEnabled = server_1.settings.get('CAS_Sync_User_Data_Enabled');
    const flagEmailAsVerified = server_1.settings.get('Accounts_Verify_Email_For_External_Accounts');
    const userCreationEnabled = server_1.settings.get('CAS_Creation_User_Enabled');
    const { username, attributes: credentialsAttributes } = result;
    // We have these
    const externalAttributes = {
        username,
    };
    // We need these
    const internalAttributes = {
        email: undefined,
        name: undefined,
        username: undefined,
        rooms: undefined,
    };
    // Import response attributes
    if (casVersion >= 2.0) {
        try {
            // Clean & import external attributes
            for (var _l = true, _m = __asyncValues(Object.entries(credentialsAttributes)), _o; _o = yield _m.next(), _a = _o.done, !_a; _l = true) {
                _c = _o.value;
                _l = false;
                const [externalName, value] = _c;
                if (value) {
                    externalAttributes[externalName] = value[0];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_l && !_a && (_b = _m.return)) yield _b.call(_m);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // Source internal attributes
    if (syncUserDataFieldMap) {
        // Our mapping table: key(int_attr) -> value(ext_attr)
        // Spoken: Source this internal attribute from these external attributes
        const attributeMap = (0, tools_1.wrapExceptions)(() => JSON.parse(syncUserDataFieldMap)).catch((err) => {
            logger_1.logger.error({ msg: 'Invalid JSON for attribute mapping', err });
            throw err;
        });
        try {
            for (var _p = true, _q = __asyncValues(Object.entries(attributeMap)), _r; _r = yield _q.next(), _d = _r.done, !_d; _p = true) {
                _f = _r.value;
                _p = false;
                const [internalName, source] = _f;
                if (!source || typeof source.valueOf() !== 'string') {
                    continue;
                }
                let replacedValue = source;
                try {
                    for (var _s = true, _t = (e_3 = void 0, __asyncValues((0, tools_1.getObjectKeys)(externalAttributes))), _u; _u = yield _t.next(), _g = _u.done, !_g; _s = true) {
                        _j = _u.value;
                        _s = false;
                        const externalName = _j;
                        replacedValue = replacedValue.replace(`%${externalName}%`, externalAttributes[externalName]);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_s && !_g && (_h = _t.return)) yield _h.call(_t);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                if (source !== replacedValue) {
                    internalAttributes[internalName] = replacedValue;
                    logger_1.logger.debug(`Sourced internal attribute: ${internalName} = ${replacedValue}`);
                }
                else {
                    logger_1.logger.debug(`Sourced internal attribute: ${internalName} skipped.`);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_p && !_d && (_e = _q.return)) yield _e.call(_q);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    // Search existing user by its external service id
    logger_1.logger.debug(`Looking up user by id: ${username}`);
    // First, look for a user that has logged in from CAS with this username before
    const user = yield (0, findExistingCASUser_1.findExistingCASUser)(username);
    if (user) {
        logger_1.logger.debug(`Using existing user for '${username}' with id: ${user._id}`);
        if (syncEnabled) {
            logger_1.logger.debug('Syncing user attributes');
            // Update name
            if (internalAttributes.name) {
                yield (0, setRealName_1._setRealName)(user._id, internalAttributes.name);
            }
            // Update email
            if (internalAttributes.email) {
                yield models_1.Users.updateOne({ _id: user._id }, { $set: { emails: [{ address: internalAttributes.email, verified: flagEmailAsVerified }] } });
            }
        }
        return { userId: user._id };
    }
    if (!userCreationEnabled) {
        // Should fail as no user exist and can't be created
        logger_1.logger.debug(`User "${username}" does not exist yet, will fail as no user creation is enabled`);
        throw new Meteor.Error(accounts_base_1.Accounts.LoginCancelledError.numericError, 'no matching user account found');
    }
    const newUser = yield (0, createNewUser_1.createNewUser)(username, {
        attributes: internalAttributes,
        casVersion,
        flagEmailAsVerified,
    });
    return { userId: newUser._id };
});
exports.loginHandlerCAS = loginHandlerCAS;
