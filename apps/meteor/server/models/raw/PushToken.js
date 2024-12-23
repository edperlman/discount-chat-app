"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTokenRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class PushTokenRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, '_raix_push_app_tokens', undefined, {
            collectionNameResolver(name) {
                return name;
            },
        });
    }
    modelIndexes() {
        return [{ key: { userId: 1, authToken: 1 } }, { key: { appName: 1, token: 1 } }];
    }
    removeByUserIdExceptTokens(userId, tokens) {
        return this.deleteMany({
            userId,
            authToken: { $nin: tokens },
        });
    }
    removeAllByUserId(userId) {
        return this.deleteMany({
            userId,
        });
    }
}
exports.PushTokenRaw = PushTokenRaw;
