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
exports.userAvatarById = exports.userAvatarByUsername = void 0;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const utils_1 = require("./utils");
const server_1 = require("../../../app/settings/server");
const handleExternalProvider = (externalProviderUrl, username, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, server_fetch_1.serverFetch)(externalProviderUrl.replace('{username}', username));
    response.headers.forEach((value, key) => res.setHeader(key, value));
    response.body.pipe(res);
});
// request /avatar/@name forces returning the svg
const userAvatarByUsername = function (request, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = request;
        if (!req.url) {
            return;
        }
        // replace removes the query string
        const requestUsername = decodeURIComponent(req.url.slice(1).replace(/\?.*$/, ''));
        if (!requestUsername) {
            res.writeHead(404);
            res.end();
            return;
        }
        (0, utils_1.setCacheAndDispositionHeaders)(req, res);
        const externalProviderUrl = server_1.settings.get('Accounts_AvatarExternalProviderUrl');
        if (externalProviderUrl) {
            void handleExternalProvider(externalProviderUrl, requestUsername, res);
            return;
        }
        // if request starts with @ always return the svg letters
        if (requestUsername[0] === '@') {
            (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: requestUsername.slice(1), req, res });
            return;
        }
        const file = yield models_1.Avatars.findOneByName(requestUsername);
        if (file) {
            void (0, utils_1.serveAvatarFile)(file, req, res, next);
            return;
        }
        // if still using "letters fallback"
        if (!(0, utils_1.wasFallbackModified)(req.headers['if-modified-since'])) {
            res.writeHead(304);
            res.end();
            return;
        }
        // Use real name for SVG letters
        if (server_1.settings.get('UI_Use_Name_Avatar')) {
            const user = yield models_1.Users.findOneByUsernameIgnoringCase(requestUsername, {
                projection: {
                    name: 1,
                },
            });
            if (user === null || user === void 0 ? void 0 : user.name) {
                (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: user.name, req, res });
                return;
            }
        }
        (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: requestUsername, req, res });
    });
};
exports.userAvatarByUsername = userAvatarByUsername;
const userAvatarById = function (request, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = request;
        if (!req.url) {
            return;
        }
        // replace removes the query string
        const requestUserId = decodeURIComponent(req.url.slice(1).replace(/\?.*$/, ''));
        if (!requestUserId) {
            res.writeHead(404);
            res.end();
            return;
        }
        (0, utils_1.setCacheAndDispositionHeaders)(req, res);
        const externalProviderUrl = server_1.settings.get('Accounts_AvatarExternalProviderUrl');
        if (externalProviderUrl) {
            const user = yield models_1.Users.findOneById(requestUserId, { projection: { username: 1 } });
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                res.writeHead(404);
                res.end();
                return;
            }
            void handleExternalProvider(externalProviderUrl, user.username, res);
            return;
        }
        const file = yield models_1.Avatars.findOneByUserId(requestUserId);
        if (file) {
            void (0, utils_1.serveAvatarFile)(file, req, res, next);
            return;
        }
        if (!(0, utils_1.wasFallbackModified)(req.headers['if-modified-since'])) {
            res.writeHead(304);
            res.end();
            return;
        }
        const user = yield models_1.Users.findOneById(requestUserId, { projection: { username: 1, name: 1 } });
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            res.writeHead(404);
            res.end();
            return;
        }
        // Use real name for SVG letters
        if (server_1.settings.get('UI_Use_Name_Avatar') && (user === null || user === void 0 ? void 0 : user.name)) {
            (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: user.name, req, res });
            return;
        }
        (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: user.username, req, res });
    });
};
exports.userAvatarById = userAvatarById;
