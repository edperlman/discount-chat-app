"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsModel = void 0;
const BaseRaw_1 = require("./BaseRaw");
class AppsModel extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'apps');
    }
}
exports.AppsModel = AppsModel;
