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
exports.GridFSStore = void 0;
const mongo_1 = require("meteor/mongo");
const mongodb_1 = require("mongodb");
const ufs_1 = require("./ufs");
class GridFSStore extends ufs_1.UploadFS.Store {
    constructor(options) {
        // Default options
        options = Object.assign({
            chunkSize: 1024 * 255,
            collectionName: 'uploadfs',
        }, options);
        // Check options
        if (typeof options.chunkSize !== 'number') {
            throw new TypeError('GridFSStore: chunkSize is not a number');
        }
        if (typeof options.collectionName !== 'string') {
            throw new TypeError('GridFSStore: collectionName is not a string');
        }
        super(options);
        this.chunkSize = options.chunkSize;
        this.collectionName = options.collectionName;
        // const mongo = MongoInternals.NpmModule;
        const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
        const mongoStore = new mongodb_1.GridFSBucket(db, {
            bucketName: options.collectionName,
            chunkSizeBytes: this.chunkSize,
        });
        this.delete = function (fileId) {
            return __awaiter(this, void 0, void 0, function* () {
                const collectionName = `${options.collectionName}.files`;
                const file = yield db.collection(collectionName).findOne({ _id: fileId });
                if (file) {
                    yield mongoStore.delete(fileId);
                }
            });
        };
        this.getReadStream = function (fileId, _file, options) {
            return __awaiter(this, void 0, void 0, function* () {
                options = Object.assign({}, options);
                // https://mongodb.github.io/node-mongodb-native/4.4/interfaces/GridFSBucketReadStreamOptionsWithRevision.html#end
                // according to the mongodb doc, the end is 0-based offset in bytes to stop streaming before -<< BEFORE
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range
                // <range-end> an integer in the given unit indicating the end position (zero-indexed & inclusive) of the requested range. -<< inclusive
                // so before there always one byte miss, then browser will send a start=end request, with case fail to get the DB's last byte
                // this will leads to audio's duration Infinite and keep waiting...
                if (options === null || options === void 0 ? void 0 : options.end) {
                    options.end += 1;
                }
                return mongoStore.openDownloadStream(fileId, options);
            });
        };
        this.getWriteStream = function (fileId, file, _options) {
            return __awaiter(this, void 0, void 0, function* () {
                const writeStream = mongoStore.openUploadStreamWithId(fileId, fileId, {
                    chunkSizeBytes: this.chunkSize,
                    contentType: file.type,
                });
                let finished = false;
                writeStream.on('finish', () => {
                    finished = true;
                });
                writeStream.on('close', () => {
                    if (!finished) {
                        writeStream.emit('finish');
                    }
                });
                return writeStream;
            });
        };
    }
}
exports.GridFSStore = GridFSStore;
// Add store to UFS namespace
ufs_1.UploadFS.store.GridFS = GridFSStore;
