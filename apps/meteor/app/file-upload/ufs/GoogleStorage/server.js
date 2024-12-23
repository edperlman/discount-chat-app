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
const storage_1 = require("@google-cloud/storage");
const random_1 = require("@rocket.chat/random");
const check_1 = require("meteor/check");
const system_1 = require("../../../../server/lib/logger/system");
const ufs_1 = require("../../../../server/ufs");
class GoogleStorageStore extends ufs_1.UploadFS.Store {
    constructor(options) {
        super(options);
        const gcs = new storage_1.Storage(options.connection);
        const bucket = gcs.bucket(options.bucket);
        options.getPath =
            options.getPath ||
                function (file) {
                    return file._id;
                };
        this.getPath = function (file) {
            if (file.GoogleStorage) {
                return file.GoogleStorage.path;
            }
            // Compatibility
            // TODO: Migration
            if (file.googleCloudStorage) {
                return file.googleCloudStorage.path + file._id;
            }
            return file._id;
        };
        this.getRedirectURL = (file_1, ...args_1) => __awaiter(this, [file_1, ...args_1], void 0, function* (file, forceDownload = false) {
            const params = {
                action: 'read',
                responseDisposition: forceDownload ? 'attachment' : 'inline',
                expires: Date.now() + options.URLExpiryTimeSpan * 1000,
            };
            const res = yield bucket.file(this.getPath(file)).getSignedUrl(params);
            return res[0];
        });
        /**
         * Creates the file in the collection
         * @param file
         * @param callback
         * @return {string}
         */
        this.create = function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                (0, check_1.check)(file, Object);
                if (file._id == null) {
                    file._id = random_1.Random.id();
                }
                file.GoogleStorage = {
                    path: options.getPath(file),
                };
                file.store = this.options.name; // assign store to file
                return (yield this.getCollection().insertOne(file)).insertedId;
            });
        };
        /**
         * Removes the file
         * @param fileId
         * @param callback
         */
        this.delete = function (fileId) {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO
                const file = yield this.getCollection().findOne({ _id: fileId });
                if (!file) {
                    throw new Error('File not found');
                }
                try {
                    return bucket.file(this.getPath(file)).delete();
                }
                catch (err) {
                    system_1.SystemLogger.error(err);
                }
            });
        };
        /**
         * Returns the file read stream
         * @param fileId
         * @param file
         * @param options
         * @return {*}
         */
        this.getReadStream = function (_fileId_1, file_1) {
            return __awaiter(this, arguments, void 0, function* (_fileId, file, options = {}) {
                const config = {};
                if (options.start != null) {
                    config.start = options.start;
                }
                if (options.end != null) {
                    config.end = options.end;
                }
                return bucket.file(this.getPath(file)).createReadStream(config);
            });
        };
        /**
         * Returns the file write stream
         * @param fileId
         * @param file
         * @param options
         * @return {*}
         */
        this.getWriteStream = function (_fileId, file /* , options*/) {
            return __awaiter(this, void 0, void 0, function* () {
                return bucket.file(this.getPath(file)).createWriteStream({
                    gzip: false,
                    metadata: {
                        contentType: file.type,
                        contentDisposition: `inline; filename=${file.name}`,
                        // metadata: {
                        // 	custom: 'metadata'
                        // }
                    },
                });
            });
        };
    }
}
// Add store to UFS namespace
ufs_1.UploadFS.store.GoogleStorage = GoogleStorageStore;
