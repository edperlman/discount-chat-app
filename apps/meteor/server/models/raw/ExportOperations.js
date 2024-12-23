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
exports.ExportOperationsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class ExportOperationsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'export_operations', trash);
    }
    modelIndexes() {
        return [{ key: { userId: 1 } }, { key: { status: 1 } }];
    }
    findOnePending() {
        const query = {
            status: { $nin: ['completed', 'skipped'] },
        };
        return this.findOne(query);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.insertOne(Object.assign(Object.assign({}, data), { createdAt: new Date() }));
            return result.insertedId;
        });
    }
    findLastOperationByUser(userId, fullExport = false) {
        const query = {
            userId,
            fullExport,
        };
        return this.findOne(query, { sort: { createdAt: -1 } });
    }
    findAllPendingBeforeMyRequest(requestDay) {
        const query = {
            status: { $nin: ['completed', 'skipped'] },
            createdAt: { $lt: requestDay },
        };
        return this.find(query);
    }
    countAllPendingBeforeMyRequest(requestDay) {
        const query = {
            status: { $nin: ['completed', 'skipped'] },
            createdAt: { $lt: requestDay },
        };
        return this.countDocuments(query);
    }
    updateOperation(data) {
        const update = {
            $set: {
                roomList: data.roomList,
                status: data.status,
                fileList: data.fileList,
                generatedFile: data.generatedFile,
                fileId: data.fileId,
                userNameTable: data.userNameTable,
                userData: data.userData,
                generatedUserFile: data.generatedUserFile,
                generatedAvatar: data.generatedAvatar,
                exportPath: data.exportPath,
                assetsPath: data.assetsPath,
            },
        };
        return this.updateOne({ _id: data._id }, update);
    }
}
exports.ExportOperationsRaw = ExportOperationsRaw;
