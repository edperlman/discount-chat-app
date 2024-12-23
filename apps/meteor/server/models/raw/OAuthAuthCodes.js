"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAuthCodesRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class OAuthAuthCodesRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'oauth_auth_codes', trash);
    }
    modelIndexes() {
        return [{ key: { authCode: 1 } }, { key: { expires: 1 }, expireAfterSeconds: 60 * 5 }];
    }
    findOneByAuthCode(authCode, options) {
        return this.findOne({ authCode }, options);
    }
}
exports.OAuthAuthCodesRaw = OAuthAuthCodesRaw;
