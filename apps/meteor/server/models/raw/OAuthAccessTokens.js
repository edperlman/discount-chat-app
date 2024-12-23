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
exports.OAuthAccessTokensRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class OAuthAccessTokensRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'oauth_access_tokens', trash);
    }
    modelIndexes() {
        return [
            { key: { accessToken: 1 } },
            { key: { refreshToken: 1 } },
            { key: { expires: 1 }, expireAfterSeconds: 60 * 60 * 24 * 30 },
            { key: { refreshTokenExpiresAt: 1 }, expireAfterSeconds: 60 * 60 * 24 * 30 },
        ];
    }
    findOneByAccessToken(accessToken, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken) {
                return null;
            }
            return this.findOne({ accessToken }, options);
        });
    }
    findOneByRefreshToken(refreshToken, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                return null;
            }
            return this.findOne({ refreshToken }, options);
        });
    }
}
exports.OAuthAccessTokensRaw = OAuthAccessTokensRaw;
