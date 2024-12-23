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
exports.CannedResponseRaw = void 0;
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
// TODO need to define type for CannedResponse object
class CannedResponseRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'canned_response');
    }
    modelIndexes() {
        return [
            {
                key: {
                    shortcut: 1,
                },
                unique: true,
            },
        ];
    }
    updateCannedResponse(_id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_id, { shortcut, text, tags, scope, userId, departmentId, createdBy }) {
            const record = {
                shortcut,
                text,
                scope,
                tags,
                userId,
                departmentId,
                createdBy,
            };
            yield this.updateOne({ _id }, { $set: record });
            return Object.assign(record, { _id });
        });
    }
    createCannedResponse(_a) {
        return __awaiter(this, arguments, void 0, function* ({ shortcut, text, tags, scope, userId, departmentId, createdBy, _createdAt, }) {
            const record = {
                shortcut,
                text,
                scope,
                tags,
                userId,
                departmentId,
                createdBy,
                _createdAt,
            };
            const _id = (yield this.insertOne(record)).insertedId;
            return Object.assign(record, { _id });
        });
    }
    findOneById(_id, options) {
        const query = { _id };
        return this.findOne(query, options);
    }
    findOneByShortcut(shortcut, options) {
        const query = {
            shortcut,
        };
        return this.findOne(query, options);
    }
    findByCannedResponseId(_id, options) {
        const query = { _id };
        return this.find(query, options);
    }
    findByDepartmentId(departmentId, options) {
        const query = {
            scope: 'department',
            departmentId,
        };
        return this.find(query, options);
    }
    findByShortcut(shortcut, options) {
        const query = { shortcut };
        return this.find(query, options);
    }
    // REMOVE
    removeById(_id) {
        const query = { _id };
        return this.deleteOne(query);
    }
    removeTagFromCannedResponses(tagId) {
        const update = {
            $pull: {
                tags: tagId,
            },
        };
        return this.updateMany({}, update);
    }
}
exports.CannedResponseRaw = CannedResponseRaw;
