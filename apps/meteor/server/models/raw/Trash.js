"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class TrashRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'rocketchat__trash', undefined, {
            collectionNameResolver(name) {
                return name;
            },
        });
    }
    modelIndexes() {
        return [
            { key: { __collection__: 1 } },
            { key: { _deletedAt: 1 }, expireAfterSeconds: 60 * 60 * 24 * 30 },
            { key: { rid: 1, __collection__: 1, _deletedAt: 1 } },
        ];
    }
}
exports.TrashRaw = TrashRaw;
