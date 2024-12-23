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
exports.AppGridFSSourceStorage = void 0;
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
const mongo_1 = require("meteor/mongo");
const mongodb_1 = require("mongodb");
const streamToBuffer_1 = require("../../../../app/file-upload/server/lib/streamToBuffer");
class AppGridFSSourceStorage extends storage_1.AppSourceStorage {
    constructor() {
        super();
        this.pathPrefix = 'GridFS:/';
        const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
        this.bucket = new mongodb_1.GridFSBucket(db, {
            bucketName: 'rocketchat_apps_packages',
            chunkSizeBytes: 1024 * 255,
        });
    }
    store(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const filename = this.itemToFilename(item);
                const writeStream = this.bucket
                    .openUploadStream(filename)
                    .on('finish', () => resolve(this.idToPath(writeStream.id)))
                    .on('error', (error) => reject(error));
                writeStream.write(zip);
                writeStream.end();
            });
        });
    }
    fetch(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, streamToBuffer_1.streamToBuffer)(this.bucket.openDownloadStream(this.itemToObjectId(item)));
        });
    }
    update(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const fileId = this.itemToFilename(item);
                const writeStream = this.bucket
                    .openUploadStream(fileId)
                    .on('finish', () => {
                    resolve(this.idToPath(writeStream.id));
                    // An error in the following line would not cause the update process to fail
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    this.remove(item).catch(() => { });
                })
                    .on('error', (error) => reject(error));
                writeStream.write(zip);
                writeStream.end();
            });
        });
    }
    remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.bucket.delete(this.itemToObjectId(item), (error) => {
                    if (error) {
                        if (error.message.includes('File not found for id')) {
                            console.warn(`This instance could not remove the ${item.info.name} app package. If you are running Rocket.Chat in a cluster with multiple instances, possibly other instance removed the package. If this is not the case, it is possible that the file in the database got renamed or removed manually.`);
                            return resolve();
                        }
                        return reject(error);
                    }
                    resolve();
                });
            });
        });
    }
    itemToFilename(item) {
        return `${item.info.nameSlug}-${item.info.version}.package`;
    }
    idToPath(id) {
        return this.pathPrefix + id;
    }
    itemToObjectId(item) {
        var _a;
        return new mongodb_1.ObjectId((_a = item.sourcePath) === null || _a === void 0 ? void 0 : _a.substring(this.pathPrefix.length));
    }
}
exports.AppGridFSSourceStorage = AppGridFSSourceStorage;
