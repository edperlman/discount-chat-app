"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataFilesRaw = void 0;
const BaseUploadModel_1 = require("./BaseUploadModel");
class UserDataFilesRaw extends BaseUploadModel_1.BaseUploadModelRaw {
    constructor(db, trash) {
        super(db, 'user_data_files', trash);
    }
    modelIndexes() {
        return [...super.modelIndexes(), { key: { userId: 1 } }];
    }
    findLastFileByUser(userId, options = {}) {
        const query = {
            userId,
        };
        options.sort = { _updatedAt: -1 };
        return this.findOne(query, options);
    }
    // INSERT
    create(data) {
        const userDataFile = Object.assign({ createdAt: new Date() }, data);
        return this.insertOne(userDataFile);
    }
}
exports.UserDataFilesRaw = UserDataFilesRaw;
