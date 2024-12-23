"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUserStatusRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class CustomUserStatusRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'custom_user_status', trash);
    }
    modelIndexes() {
        return [{ key: { name: 1 } }];
    }
    findOneByName(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return options ? this.findOne({ name }, options) : this.findOne({ name });
        });
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
    setStatusType(_id, statusType) {
        const update = {
            $set: {
                statusType,
            },
        };
        return this.updateOne({ _id }, update);
    }
    // INSERT
    create(data) {
        return this.insertOne(data);
    }
}
exports.CustomUserStatusRaw = CustomUserStatusRaw;
