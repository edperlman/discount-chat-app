"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebdavAccountsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class WebdavAccountsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'webdav_accounts', trash);
    }
    modelIndexes() {
        return [{ key: { userId: 1 } }];
    }
    findOneByIdAndUserId(_id, userId, options) {
        return this.findOne({ _id, userId }, options);
    }
    findOneByUserIdServerUrlAndUsername({ userId, serverURL, username, }, options) {
        return this.findOne({ userId, serverURL, username }, options);
    }
    findWithUserId(userId, options) {
        const query = { userId };
        return this.find(query, options);
    }
    removeByUserAndId(_id, userId) {
        return this.deleteOne({ _id, userId });
    }
}
exports.WebdavAccountsRaw = WebdavAccountsRaw;
