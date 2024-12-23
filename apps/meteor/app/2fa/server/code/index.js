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
exports.emailCheck = void 0;
exports.getUserForCheck = getUserForCheck;
exports.checkCodeForUser = checkCodeForUser;
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const EmailCheck_1 = require("./EmailCheck");
const PasswordCheckFallback_1 = require("./PasswordCheckFallback");
const TOTPCheck_1 = require("./TOTPCheck");
const server_1 = require("../../../settings/server");
const totpCheck = new TOTPCheck_1.TOTPCheck();
exports.emailCheck = new EmailCheck_1.EmailCheck();
const passwordCheckFallback = new PasswordCheckFallback_1.PasswordCheckFallback();
const checkMethods = new Map();
checkMethods.set(totpCheck.name, totpCheck);
checkMethods.set(exports.emailCheck.name, exports.emailCheck);
function getMethodByNameOrFirstActiveForUser(user, name) {
    if (name && checkMethods.has(name)) {
        return checkMethods.get(name);
    }
    return Array.from(checkMethods.values()).find((method) => method.isEnabled(user));
}
function getAvailableMethodNames(user) {
    return (Array.from(checkMethods)
        .filter(([, method]) => method.isEnabled(user))
        .map(([name]) => name) || []);
}
function getUserForCheck(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return models_1.Users.findOneById(userId, {
            projection: {
                emails: 1,
                language: 1,
                createdAt: 1,
                services: 1,
            },
        });
    });
}
function getFingerprintFromConnection(connection) {
    const data = JSON.stringify({
        userAgent: connection.httpHeaders['user-agent'],
        clientAddress: connection.clientAddress,
    });
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
function getRememberDate(from = new Date()) {
    const rememberFor = parseInt(server_1.settings.get('Accounts_TwoFactorAuthentication_RememberFor'), 10);
    if (rememberFor <= 0) {
        return;
    }
    const expires = new Date(from);
    expires.setSeconds(expires.getSeconds() + rememberFor);
    return expires;
}
function isAuthorizedForToken(connection, user, options) {
    var _a, _b, _c;
    const currentToken = accounts_base_1.Accounts._getLoginToken(connection.id);
    const tokenObject = (_c = (_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens) === null || _c === void 0 ? void 0 : _c.find((i) => i.hashedToken === currentToken);
    if (!tokenObject) {
        return false;
    }
    // if any two factor is required, early abort
    if (options.requireSecondFactor) {
        return false;
    }
    if ('bypassTwoFactor' in tokenObject && tokenObject.bypassTwoFactor === true) {
        return true;
    }
    if (options.disableRememberMe === true) {
        return false;
    }
    // remember user right after their registration
    const rememberAfterRegistration = user.createdAt && getRememberDate(user.createdAt);
    if (rememberAfterRegistration && rememberAfterRegistration >= new Date()) {
        return true;
    }
    if (!tokenObject.twoFactorAuthorizedUntil || !tokenObject.twoFactorAuthorizedHash) {
        return false;
    }
    if (tokenObject.twoFactorAuthorizedUntil < new Date()) {
        return false;
    }
    if (tokenObject.twoFactorAuthorizedHash !== getFingerprintFromConnection(connection)) {
        return false;
    }
    return true;
}
function rememberAuthorization(connection, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentToken = accounts_base_1.Accounts._getLoginToken(connection.id);
        const expires = getRememberDate();
        if (!expires) {
            return;
        }
        if (!currentToken) {
            return;
        }
        yield models_1.Users.setTwoFactorAuthorizationHashAndUntilForUserIdAndToken(user._id, currentToken, getFingerprintFromConnection(connection), expires);
    });
}
const getSecondFactorMethod = (user, method, options) => {
    // try first getting one of the available methods or the one that was already provided
    const selectedMethod = getMethodByNameOrFirstActiveForUser(user, method);
    if (selectedMethod) {
        return selectedMethod;
    }
    // if none found but a second factor is required, chose the password check
    if (options.requireSecondFactor) {
        return passwordCheckFallback;
    }
    // check if password fallback is enabled
    if (!options.disablePasswordFallback && passwordCheckFallback.isEnabled(user, !!options.requireSecondFactor)) {
        return passwordCheckFallback;
    }
};
function checkCodeForUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user, code, method, options = {}, connection }) {
        var _b;
        if (process.env.TEST_MODE && !options.requireSecondFactor) {
            return true;
        }
        if (!server_1.settings.get('Accounts_TwoFactorAuthentication_Enabled')) {
            return true;
        }
        let existingUser;
        if (typeof user === 'string') {
            existingUser = yield getUserForCheck(user);
        }
        else {
            existingUser = user;
        }
        if (!existingUser) {
            throw new meteor_1.Meteor.Error('totp-user-not-found', 'TOTP User not found');
        }
        if (!code && !method && ((_b = connection === null || connection === void 0 ? void 0 : connection.httpHeaders) === null || _b === void 0 ? void 0 : _b['x-2fa-code']) && connection.httpHeaders['x-2fa-method']) {
            code = connection.httpHeaders['x-2fa-code'];
            method = connection.httpHeaders['x-2fa-method'];
        }
        if (connection && isAuthorizedForToken(connection, existingUser, options)) {
            return true;
        }
        // select a second factor method or return if none is found/available
        const selectedMethod = getSecondFactorMethod(existingUser, method, options);
        if (!selectedMethod) {
            return true;
        }
        const data = yield selectedMethod.processInvalidCode(existingUser);
        const availableMethods = getAvailableMethodNames(existingUser);
        if (!code) {
            throw new meteor_1.Meteor.Error('totp-required', 'TOTP Required', Object.assign(Object.assign({ method: selectedMethod.name }, data), { availableMethods }));
        }
        const valid = yield selectedMethod.verify(existingUser, code, options.requireSecondFactor);
        if (!valid) {
            const tooManyFailedAttempts = yield selectedMethod.maxFaildedAttemtpsReached(existingUser);
            if (tooManyFailedAttempts) {
                throw new meteor_1.Meteor.Error('totp-max-attempts', 'TOTP Maximun Failed Attempts Reached', Object.assign(Object.assign({ method: selectedMethod.name }, data), { availableMethods }));
            }
            throw new meteor_1.Meteor.Error('totp-invalid', 'TOTP Invalid', Object.assign(Object.assign({ method: selectedMethod.name }, data), { availableMethods }));
        }
        if (options.disableRememberMe !== true && connection) {
            yield rememberAuthorization(connection, existingUser);
        }
        return true;
    });
}
