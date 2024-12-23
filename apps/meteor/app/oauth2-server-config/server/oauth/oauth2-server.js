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
exports.oAuth2ServerAuth = oAuth2ServerAuth;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const oauth_1 = require("../../../../server/oauth2-server/oauth");
const server_1 = require("../../../api/server");
const oauth2server = new oauth_1.OAuth2Server({
    // If you're developing something related to oauth servers, you should change this to true
    debug: false,
});
// https://github.com/RocketChat/rocketchat-oauth2-server/blob/e758fd7ef69348c7ceceabe241747a986c32d036/model.coffee#L27-L27
function getAccessToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return models_1.OAuthAccessTokens.findOneByAccessToken(accessToken);
    });
}
function oAuth2ServerAuth(partialRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const headerToken = (_a = partialRequest.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const queryToken = partialRequest.query.access_token;
        const accessToken = yield getAccessToken(headerToken || queryToken);
        // If there is no token available or the token has expired, return undefined
        if (!accessToken || (accessToken.expires != null && accessToken.expires < new Date())) {
            return;
        }
        const user = yield models_1.Users.findOneById(accessToken.userId);
        if (user == null) {
            return;
        }
        return { user };
    });
}
oauth2server.app.disable('x-powered-by');
webapp_1.WebApp.connectHandlers.use(oauth2server.app);
oauth2server.app.get('/oauth/userinfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (req.headers.authorization == null) {
        return res.status(401).send('No token');
    }
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const token = yield getAccessToken(accessToken);
    if (token == null) {
        return res.status(401).send('Invalid Token');
    }
    const user = yield models_1.Users.findOneById(token.userId);
    if (user == null) {
        return res.status(401).send('Invalid Token');
    }
    return res.send({
        sub: user._id,
        name: user.name,
        email: (_a = user.emails) === null || _a === void 0 ? void 0 : _a[0].address,
        email_verified: (_b = user.emails) === null || _b === void 0 ? void 0 : _b[0].verified,
        department: '',
        birthdate: '',
        preffered_username: user.username,
        updated_at: user._updatedAt,
        picture: `${meteor_1.Meteor.absoluteUrl()}avatar/${user.username}`,
    });
}));
server_1.API.v1.addAuthMethod(function () {
    return __awaiter(this, void 0, void 0, function* () {
        return oAuth2ServerAuth(this.request);
    });
});
