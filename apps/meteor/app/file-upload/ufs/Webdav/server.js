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
const check_1 = require("meteor/check");
const system_1 = require("../../../../server/lib/logger/system");
const ufs_1 = require("../../../../server/ufs");
const webdavClientAdapter_1 = require("../../../webdav/server/lib/webdavClientAdapter");
class WebdavStore extends ufs_1.UploadFS.Store {
    constructor(options) {
        super(options);
        const { server, username, password } = options.connection.credentials;
        const client = new webdavClientAdapter_1.WebdavClientAdapter(server, { username, password });
        options.getPath = function (file) {
            if (options.uploadFolderPath[options.uploadFolderPath.length - 1] !== '/') {
                options.uploadFolderPath += '/';
            }
            return options.uploadFolderPath + file._id;
        };
        client.stat(options.uploadFolderPath).catch((err) => {
            if (err.message.toLowerCase() === 'not found') {
                void client.createDirectory(options.uploadFolderPath);
            }
            else if (err.message.toLowerCase() === 'unauthorized') {
                console.warn('File upload is unauthorized to connect on Webdav, please verify your credentials');
            }
        });
        /**
         * Returns the file path
         * @param file
         * @return {string}
         */
        this.getPath = function (file) {
            if (file.Webdav) {
                return file.Webdav.path;
            }
            return file._id;
        };
        /**
         * Creates the file in the col lection
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
                file.Webdav = {
                    path: options.getPath(file),
                };
                file.store = this.options.name;
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
                const file = yield this.getCollection().findOne({ _id: fileId });
                if (!file) {
                    throw new Error('File no found');
                }
                try {
                    return client.deleteFile(this.getPath(file));
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
                const range = {};
                if (options.start != null) {
                    range.start = options.start;
                }
                if (options.end != null) {
                    range.end = options.end;
                }
                return client.createReadStream(this.getPath(file), options);
            });
        };
        /**
         * Returns the file write stream
         * @param fileId
         * @param file
         * @return {*}
         */
        this.getWriteStream = function (_fileId, file) {
            return __awaiter(this, void 0, void 0, function* () {
                const writeStream = new stream_1.default.PassThrough();
                const webdavStream = client.createWriteStream(this.getPath(file), file.size || 0);
                // TODO remove timeout when UploadFS bug resolved
                const newListenerCallback = (event, listener) => {
                    if (event === 'finish') {
                        process.nextTick(() => {
                            writeStream.removeListener(event, listener);
                            writeStream.removeListener('newListener', newListenerCallback);
                            writeStream.on(event, () => {
                                setTimeout(listener, 500);
                            });
                        });
                    }
                };
                writeStream.on('newListener', newListenerCallback);
                writeStream.pipe(webdavStream);
                return writeStream;
            });
        };
    }
}
// Add store to UFS namespace
ufs_1.UploadFS.store.Webdav = WebdavStore;
