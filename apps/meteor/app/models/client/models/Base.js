"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const check_1 = require("meteor/check");
const mongo_1 = require("meteor/mongo");
class Base {
    _baseName() {
        return 'rocketchat_';
    }
    _initModel(name) {
        (0, check_1.check)(name, String);
        this.model = new mongo_1.Mongo.Collection(this._baseName() + name);
        return this.model;
    }
    find(...args) {
        return this.model.find(...args);
    }
    findOne(...args) {
        return this.model.findOne(...args);
    }
    insert(...args) {
        return this.model.insert(...args);
    }
    update(...args) {
        return this.model.update(...args);
    }
    upsert(...args) {
        return this.model.upsert(...args);
    }
    remove(...args) {
        return this.model.remove(...args);
    }
    allow(...args) {
        return this.model.allow(...args);
    }
    deny(...args) {
        return this.model.deny(...args);
    }
    ensureIndex() {
        // do nothing
    }
    dropIndex() {
        // do nothing
    }
    tryEnsureIndex() {
        // do nothing
    }
    tryDropIndex() {
        // do nothing
    }
}
exports.Base = Base;
