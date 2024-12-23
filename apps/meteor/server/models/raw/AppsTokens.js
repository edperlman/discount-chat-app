"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsTokens = void 0;
const BaseRaw_1 = require("./BaseRaw");
class AppsTokens extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, '_raix_push_app_tokens', undefined, { collectionNameResolver: (name) => name });
    }
    countApnTokens() {
        const query = {
            'token.apn': { $exists: true },
        };
        return this.countDocuments(query);
    }
    countGcmTokens() {
        const query = {
            'token.gcm': { $exists: true },
        };
        return this.countDocuments(query);
    }
    countTokensByUserId(userId) {
        const query = {
            userId,
            $or: [{ 'token.apn': { $exists: true } }, { 'token.gcm': { $exists: true } }],
        };
        return this.countDocuments(query);
    }
}
exports.AppsTokens = AppsTokens;
