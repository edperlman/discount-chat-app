"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsPersistenceModel = void 0;
const BaseRaw_1 = require("./BaseRaw");
class AppsPersistenceModel extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'apps_persistence');
    }
    modelIndexes() {
        return [
            {
                key: {
                    appId: 1,
                    associations: 1,
                },
            },
        ];
    }
    // Bypass trash collection
    remove(query) {
        return this.col.deleteMany(query);
    }
}
exports.AppsPersistenceModel = AppsPersistenceModel;
