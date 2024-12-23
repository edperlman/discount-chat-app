"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthRefreshTokensRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class OAuthRefreshTokensRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'oauth_refresh_tokens', trash);
    }
    modelIndexes() {
        return [{ key: { refreshToken: 1 } }, { key: { expires: 1 }, expireAfterSeconds: 60 * 60 * 24 * 30 }];
    }
    findOneByRefreshToken(refreshToken, options) {
        return this.findOne({ refreshToken }, options);
    }
}
exports.OAuthRefreshTokensRaw = OAuthRefreshTokensRaw;
