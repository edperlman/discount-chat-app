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
exports.BaseUploadModelRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class BaseUploadModelRaw extends BaseRaw_1.BaseRaw {
    modelIndexes() {
        return [
            { key: { userId: 1 }, sparse: true },
            { key: { name: 1 }, sparse: true },
            { key: { rid: 1 }, sparse: true },
            { key: { expiresAt: 1 }, sparse: true },
        ];
    }
    insertFileInit(userId_1, store_1, file_1) {
        return __awaiter(this, arguments, void 0, function* (userId, store, file, extra = {}) {
            const fileData = Object.assign(Object.assign({ userId,
                store, complete: false, uploading: true, progress: 0, extension: file.name.split('.').pop(), uploadedAt: new Date() }, file), extra);
            if (fileData.type) {
                fileData.typeGroup = fileData.type.split('/').shift();
            }
            return this.insertOne(fileData);
        });
    }
    updateFileComplete(fileId, userId, file) {
        if (!fileId) {
            return;
        }
        const filter = {
            _id: fileId,
            userId,
        };
        const update = {
            $set: {
                complete: true,
                uploading: false,
                progress: 1,
            },
        };
        update.$set = Object.assign(file, update.$set);
        if (update.$set.type) {
            update.$set.typeGroup = update.$set.type.split('/').shift();
        }
        return this.updateOne(filter, update);
    }
    confirmTemporaryFile(fileId, userId) {
        if (!fileId) {
            return;
        }
        const filter = {
            _id: fileId,
            userId,
        };
        const update = {
            $unset: {
                expiresAt: 1,
            },
        };
        return this.updateOne(filter, update);
    }
    findOneByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ name });
        });
    }
    findOneByRoomId(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ rid });
        });
    }
    findExpiredTemporaryFiles(options) {
        return this.find({
            expiresAt: {
                $lte: new Date(),
            },
        }, options);
    }
    updateFileNameById(fileId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: fileId };
            const update = {
                $set: {
                    name,
                },
            };
            return this.updateOne(filter, update);
        });
    }
    deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteOne({ _id: fileId });
        });
    }
}
exports.BaseUploadModelRaw = BaseUploadModelRaw;
