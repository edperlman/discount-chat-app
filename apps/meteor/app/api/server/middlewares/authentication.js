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
exports.authenticationMiddleware = authenticationMiddleware;
exports.hasPermissionMiddleware = hasPermissionMiddleware;
const account_utils_1 = require("@rocket.chat/account-utils");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const oauth2_server_1 = require("../../../oauth2-server-config/server/oauth/oauth2-server");
function authenticationMiddleware(config = {
    rejectUnauthorized: true,
    cookies: false,
}) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (config.cookies) {
            req.headers['x-auth-token'] = (_a = req.cookies.rc_token) !== null && _a !== void 0 ? _a : req.headers['x-auth-token'];
            req.headers['x-user-id'] = (_b = req.cookies.rc_uid) !== null && _b !== void 0 ? _b : req.headers['x-user-id'];
        }
        const { 'x-user-id': userId, 'x-auth-token': authToken } = req.headers;
        if (userId && authToken) {
            req.user = (yield models_1.Users.findOneByIdAndLoginToken(userId, (0, account_utils_1.hashLoginToken)(authToken))) || undefined;
        }
        else {
            req.user = (_c = (yield (0, oauth2_server_1.oAuth2ServerAuth)(req))) === null || _c === void 0 ? void 0 : _c.user;
        }
        if (config.rejectUnauthorized && !req.user) {
            res.status(401).send('Unauthorized');
            return;
        }
        req.userId = (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id;
        next();
    });
}
function hasPermissionMiddleware(permission, { rejectUnauthorized } = {
    rejectUnauthorized: true,
}) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.userId) {
            if (rejectUnauthorized) {
                res.status(401).send('Unauthorized');
                return;
            }
            req.unauthorized = true;
            return next();
        }
        if (!(yield core_services_1.Authorization.hasPermission(req.userId, permission))) {
            if (rejectUnauthorized) {
                res.status(403).send('Forbidden');
                return;
            }
            req.unauthorized = true;
        }
        next();
    });
}
