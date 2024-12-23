"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceCredentialsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class WorkspaceCredentialsRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'workspace_credentials');
    }
    modelIndexes() {
        return [{ key: { scope: 1, expirationDate: 1, accessToken: 1 }, unique: true }];
    }
    getCredentialByScope(scope = '') {
        const query = { scope };
        return this.findOne(query);
    }
    updateCredentialByScope({ scope, accessToken, expirationDate, }) {
        const record = {
            $set: {
                scope,
                accessToken,
                expirationDate,
            },
        };
        const query = { scope };
        return this.updateOne(query, record, { upsert: true });
    }
    removeAllCredentials() {
        return this.col.deleteMany({});
    }
}
exports.WorkspaceCredentialsRaw = WorkspaceCredentialsRaw;
