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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSuccessfulLogin = exports.saveFailedLoginAttempts = exports.isValidAttemptByUser = exports.isValidLoginAttemptByIp = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const addMinutesToADate_1 = require("../../../../lib/utils/addMinutesToADate");
const getClientAddress_1 = require("../../../../server/lib/getClientAddress");
const sendMessage_1 = require("../../../lib/server/functions/sendMessage");
const server_1 = require("../../../settings/server");
const logger = new logger_1.Logger('LoginProtection');
const notifyFailedLogin = (ipOrUsername, blockedUntil, failedAttempts) => __awaiter(void 0, void 0, void 0, function* () {
    const channelToNotify = server_1.settings.get('Block_Multiple_Failed_Logins_Notify_Failed_Channel');
    if (!channelToNotify) {
        logger.error('Cannot notify failed logins: channel provided is invalid');
        return;
    }
    // verify channel exists
    // to avoid issues when "fname" is presented in the UI, check if the name matches it as well
    const room = yield models_1.Rooms.findOneByNameOrFname(channelToNotify);
    if (!room) {
        logger.error("Cannot notify failed logins: channel provided doesn't exists");
        return;
    }
    const rocketCat = yield models_1.Users.findOneById('rocket.cat');
    // send message
    const message = {
        attachments: [
            {
                fields: [
                    {
                        title: 'Failed login attempt threshold exceeded',
                        value: `User or IP: ${ipOrUsername}\nBlocked until: ${blockedUntil}\nFailed Attempts: ${failedAttempts}`,
                        short: true,
                    },
                ],
                color: 'red',
            },
        ],
    };
    yield (0, sendMessage_1.sendMessage)(rocketCat, message, room, false);
});
const isValidLoginAttemptByIp = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const whitelist = String(server_1.settings.get('Block_Multiple_Failed_Logins_Ip_Whitelist')).split(',');
    if (!server_1.settings.get('Block_Multiple_Failed_Logins_Enabled') ||
        !server_1.settings.get('Block_Multiple_Failed_Logins_By_Ip') ||
        whitelist.includes(ip)) {
        return true;
    }
    // misconfigured
    const attemptsUntilBlock = server_1.settings.get('Block_Multiple_Failed_Logins_Attempts_Until_Block_By_Ip');
    if (!attemptsUntilBlock) {
        return true;
    }
    // if user never failed to login, then it's valid
    const lastFailedAttemptAt = (_a = (yield models_1.ServerEvents.findLastFailedAttemptByIp(ip))) === null || _a === void 0 ? void 0 : _a.ts;
    if (!lastFailedAttemptAt) {
        return true;
    }
    const minutesUntilUnblock = server_1.settings.get('Block_Multiple_Failed_Logins_Time_To_Unblock_By_Ip_In_Minutes');
    const lockoutTimeStart = (0, addMinutesToADate_1.addMinutesToADate)(new Date(), minutesUntilUnblock * -1);
    const lastSuccessfulAttemptAt = (_b = (yield models_1.ServerEvents.findLastSuccessfulAttemptByIp(ip))) === null || _b === void 0 ? void 0 : _b.ts;
    // successful logins should reset the counter
    const startTime = lastSuccessfulAttemptAt
        ? new Date(Math.max(lockoutTimeStart.getTime(), lastSuccessfulAttemptAt.getTime()))
        : lockoutTimeStart;
    const failedAttemptsSinceLastLogin = yield models_1.ServerEvents.countFailedAttemptsByIpSince(ip, startTime);
    // if user didn't reach the threshold, then it's valid
    if (failedAttemptsSinceLastLogin < attemptsUntilBlock) {
        return true;
    }
    if (server_1.settings.get('Block_Multiple_Failed_Logins_Notify_Failed')) {
        const willBeBlockedUntil = (0, addMinutesToADate_1.addMinutesToADate)(new Date(lastFailedAttemptAt), minutesUntilUnblock);
        yield notifyFailedLogin(ip, willBeBlockedUntil, failedAttemptsSinceLastLogin);
    }
    return false;
});
exports.isValidLoginAttemptByIp = isValidLoginAttemptByIp;
const isValidAttemptByUser = (login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!server_1.settings.get('Block_Multiple_Failed_Logins_Enabled') || !server_1.settings.get('Block_Multiple_Failed_Logins_By_User')) {
        return true;
    }
    const loginUsername = (_a = login.methodArguments[0].user) === null || _a === void 0 ? void 0 : _a.username;
    if (!loginUsername) {
        return true;
    }
    // misconfigured
    const attemptsUntilBlock = server_1.settings.get('Block_Multiple_Failed_Logins_Attempts_Until_Block_by_User');
    if (!attemptsUntilBlock) {
        return true;
    }
    // if user never failed to login, then it's valid
    const lastFailedAttemptAt = (_b = (yield models_1.ServerEvents.findLastFailedAttemptByUsername(loginUsername))) === null || _b === void 0 ? void 0 : _b.ts;
    if (!lastFailedAttemptAt) {
        return true;
    }
    const minutesUntilUnblock = server_1.settings.get('Block_Multiple_Failed_Logins_Time_To_Unblock_By_User_In_Minutes');
    const lockoutTimeStart = (0, addMinutesToADate_1.addMinutesToADate)(new Date(), minutesUntilUnblock * -1);
    const lastSuccessfulAttemptAt = (_c = (yield models_1.ServerEvents.findLastSuccessfulAttemptByUsername(loginUsername))) === null || _c === void 0 ? void 0 : _c.ts;
    // succesful logins should reset the counter
    const startTime = lastSuccessfulAttemptAt
        ? new Date(Math.max(lockoutTimeStart.getTime(), lastSuccessfulAttemptAt.getTime()))
        : lockoutTimeStart;
    // get total failed attempts during the lockout time
    const failedAttemptsSinceLastLogin = yield models_1.ServerEvents.countFailedAttemptsByUsernameSince(loginUsername, startTime);
    // if user didn't reach the threshold, then it's valid
    if (failedAttemptsSinceLastLogin < attemptsUntilBlock) {
        return true;
    }
    if (server_1.settings.get('Block_Multiple_Failed_Logins_Notify_Failed')) {
        const willBeBlockedUntil = (0, addMinutesToADate_1.addMinutesToADate)(new Date(lastFailedAttemptAt), minutesUntilUnblock);
        yield notifyFailedLogin(loginUsername, willBeBlockedUntil, failedAttemptsSinceLastLogin);
    }
    return false;
});
exports.isValidAttemptByUser = isValidAttemptByUser;
const saveFailedLoginAttempts = (login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = {
        _id: (_a = login.user) === null || _a === void 0 ? void 0 : _a._id,
        username: ((_b = login.user) === null || _b === void 0 ? void 0 : _b.username) || ((_c = login.methodArguments[0].user) === null || _c === void 0 ? void 0 : _c.username),
    };
    yield models_1.ServerEvents.insertOne({
        ip: (0, getClientAddress_1.getClientAddress)(login.connection),
        t: core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
        ts: new Date(),
        u: user,
    });
});
exports.saveFailedLoginAttempts = saveFailedLoginAttempts;
const saveSuccessfulLogin = (login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = {
        _id: (_a = login.user) === null || _a === void 0 ? void 0 : _a._id,
        username: ((_b = login.user) === null || _b === void 0 ? void 0 : _b.username) || ((_c = login.methodArguments[0].user) === null || _c === void 0 ? void 0 : _c.username),
    };
    yield models_1.ServerEvents.insertOne({
        ip: (0, getClientAddress_1.getClientAddress)(login.connection),
        t: core_typings_1.ServerEventType.LOGIN,
        ts: new Date(),
        u: user,
    });
});
exports.saveSuccessfulLogin = saveSuccessfulLogin;
