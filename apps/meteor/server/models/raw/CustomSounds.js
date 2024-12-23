"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSoundsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class CustomSoundsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'custom_sounds', trash);
    }
    modelIndexes() {
        return [{ key: { name: 1 } }];
    }
    // find
    findByName(name, options) {
        const query = {
            name,
        };
        return this.find(query, options);
    }
    findByNameExceptId(name, except, options) {
        const query = {
            _id: { $nin: [except] },
            name,
        };
        return this.find(query, options);
    }
    // update
    setName(_id, name) {
        const update = {
            $set: {
                name,
            },
        };
        return this.updateOne({ _id }, update);
    }
    // INSERT
    create(data) {
        return this.insertOne(data);
    }
}
exports.CustomSoundsRaw = CustomSoundsRaw;
