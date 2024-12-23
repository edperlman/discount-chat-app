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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __importDefault(require("stream"));
const random_1 = require("@rocket.chat/random");
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const check_1 = require("meteor/check");
const underscore_1 = __importDefault(require("underscore"));
const system_1 = require("../../../../server/lib/logger/system");
const ufs_1 = require("../../../../server/ufs");
class AmazonS3Store extends ufs_1.UploadFS.Store {
    constructor(options) {
        // Default options
        // options.secretAccessKey,
        // options.accessKeyId,
        // options.region,
        // options.sslEnabled // optional
        options = underscore_1.default.extend({
            httpOptions: {
                timeout: 6000,
                agent: false,
            },
        }, options);
        super(options);
        const classOptions = options;
        const s3 = new s3_1.default(options.connection);
        options.getPath =
            options.getPath ||
                function (file) {
                    return file._id;
                };
        this.getPath = function (file) {
            if (file.AmazonS3) {
                return file.AmazonS3.path;
            }
            // Compatibility
            // TODO: Migration
            if (file.s3) {
                return file.s3.path + file._id;
            }
            return file._id;
        };
        this.getRedirectURL = (file_1, ...args_1) => __awaiter(this, [file_1, ...args_1], void 0, function* (file, forceDownload = false) {
            const params = {
                Key: this.getPath(file),
                Expires: classOptions.URLExpiryTimeSpan,
                ResponseContentDisposition: `${forceDownload ? 'attachment' : 'inline'}; filename="${encodeURI(file.name || '')}"`,
            };
            return s3.getSignedUrlPromise('getObject', params);
        });
        /**
         * Creates the file in the collection
         * @param file
         * @param callback
         * @return {string}
         */
        this.create = (file) => __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(file, Object);
            if (file._id == null) {
                file._id = random_1.Random.id();
            }
            file.AmazonS3 = {
                path: classOptions.getPath(file),
            };
            file.store = this.options.name; // assign store to file
            return (yield this.getCollection().insertOne(file)).insertedId;
        });
        /**
         * Removes the file
         * @param fileId
         * @param callback
         */
        this.delete = function (fileId) {
            return __awaiter(this, void 0, void 0, function* () {
                const file = yield this.getCollection().findOne({ _id: fileId });
                if (!file) {
                    throw new Error('File not found');
                }
                const params = {
                    Key: this.getPath(file),
                    Bucket: classOptions.connection.params.Bucket,
                };
                try {
                    return s3.deleteObject(params).promise();
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
                const params = {
                    Key: this.getPath(file),
                    Bucket: classOptions.connection.params.Bucket,
                };
                if (options.start && options.end) {
                    params.Range = `${options.start} - ${options.end}`;
                }
                return s3.getObject(params).createReadStream();
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
                const writeStream = new stream_1.default.PassThrough();
                // TS does not allow but S3 requires a length property;
                writeStream.length = file.size;
                writeStream.on('newListener', (event, listener) => {
                    if (event === 'finish') {
                        process.nextTick(() => {
                            writeStream.removeListener(event, listener);
                            writeStream.on('real_finish', listener);
                        });
                    }
                });
                s3.putObject({
                    Key: this.getPath(file),
                    Body: writeStream,
                    ContentType: file.type,
                    Bucket: classOptions.connection.params.Bucket,
                }, (error) => {
                    if (error) {
                        system_1.SystemLogger.error(error);
                    }
                    writeStream.emit('real_finish');
                });
                return writeStream;
            });
        };
    }
}
// Add store to UFS namespace
ufs_1.UploadFS.store.AmazonS3 = AmazonS3Store;
