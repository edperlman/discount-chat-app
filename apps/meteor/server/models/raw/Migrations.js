"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class MigrationsRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'migrations', undefined, {
            collectionNameResolver(name) {
                return name;
            },
        });
    }
}
exports.MigrationsRaw = MigrationsRaw;
