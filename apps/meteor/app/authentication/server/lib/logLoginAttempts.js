"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFailedLoginAttempts = void 0;
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const logFailedLoginAttempts = (login) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!server_1.settings.get('Login_Logs_Enabled')) {
        return;
    }
    let user = 'unknown';
    if (((_b = (_a = login.methodArguments[0]) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username) && server_1.settings.get('Login_Logs_Username')) {
        user = (_d = (_c = login.methodArguments[0]) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.username;
    }
    const { connection } = login;
    let { clientAddress } = connection;
    if (!server_1.settings.get('Login_Logs_ClientIp')) {
        clientAddress = '-';
    }
    let forwardedFor = (_e = connection.httpHeaders) === null || _e === void 0 ? void 0 : _e['x-forwarded-for'];
    let realIp = (_f = connection.httpHeaders) === null || _f === void 0 ? void 0 : _f['x-real-ip'];
    if (!server_1.settings.get('Login_Logs_ForwardedForIp')) {
        forwardedFor = '-';
        realIp = '-';
    }
    let userAgent = (_g = connection.httpHeaders) === null || _g === void 0 ? void 0 : _g['user-agent'];
    if (!server_1.settings.get('Login_Logs_UserAgent')) {
        userAgent = '-';
    }
    system_1.SystemLogger.info(`Failed login detected - Username[${user}] ClientAddress[${clientAddress}] ForwardedFor[${forwardedFor}] XRealIp[${realIp}] UserAgent[${userAgent}]`);
};
exports.logFailedLoginAttempts = logFailedLoginAttempts;
