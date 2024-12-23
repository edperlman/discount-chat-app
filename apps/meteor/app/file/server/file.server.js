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
exports.RocketChatFile = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const stream_1 = __importDefault(require("stream"));
const mongo_1 = require("meteor/mongo");
const with_db_1 = __importDefault(require("mime-type/with-db"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const mongodb_1 = require("mongodb");
const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
class GridFS {
    constructor({ name = 'file' } = {}) {
        this.name = name;
        this.bucket = new mongodb_1.GridFSBucket(db, { bucketName: this.name });
    }
    findOne(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.bucket.find({ filename }).limit(1).toArray();
            if (!file) {
                return;
            }
            return file[0];
        });
    }
    remove(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bucket.delete(fileId);
        });
    }
    createWriteStream(fileName, contentType) {
        const ws = this.bucket.openUploadStream(fileName, {
            contentType,
        });
        ws.on('close', () => {
            return ws.emit('end');
        });
        return ws;
    }
    createReadStream(fileName) {
        return this.bucket.openDownloadStreamByName(fileName);
    }
    getFileWithReadStream(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.findOne(fileName);
            if (!file) {
                return;
            }
            const rs = this.createReadStream(fileName);
            return {
                readStream: rs,
                contentType: file.contentType,
                length: file.length,
                uploadDate: file.uploadDate,
            };
        });
    }
    getFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getFileWithReadStream(fileName);
            if (!file) {
                return;
            }
            return new Promise((resolve) => {
                const data = [];
                file.readStream.on('data', (chunk) => {
                    return data.push(chunk);
                });
                file.readStream.on('end', () => {
                    resolve({
                        buffer: Buffer.concat(data),
                        contentType: file.contentType,
                        length: file.length,
                        uploadDate: file.uploadDate,
                    });
                });
            });
        });
    }
    deleteFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.findOne(fileName);
            if (file == null) {
                return undefined;
            }
            return this.remove(file._id);
        });
    }
}
class FileSystem {
    constructor({ absolutePath = '~/uploads' } = {}) {
        if (absolutePath.split(path_1.default.sep)[0] === '~') {
            const homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
            if (homepath != null) {
                absolutePath = absolutePath.replace('~', homepath);
            }
            else {
                throw new Error('Unable to resolve "~" in path');
            }
        }
        this.absolutePath = path_1.default.resolve(absolutePath);
        mkdirp_1.default.sync(this.absolutePath);
    }
    createWriteStream(fileName) {
        const ws = fs_1.default.createWriteStream(path_1.default.join(this.absolutePath, fileName));
        ws.on('close', () => {
            return ws.emit('end');
        });
        return ws;
    }
    createReadStream(fileName) {
        return fs_1.default.createReadStream(path_1.default.join(this.absolutePath, fileName));
    }
    stat(fileName) {
        return promises_1.default.stat(path_1.default.join(this.absolutePath, fileName));
    }
    remove(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return promises_1.default.unlink(path_1.default.join(this.absolutePath, fileName));
        });
    }
    getFileWithReadStream(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stat = yield this.stat(fileName);
                const rs = this.createReadStream(fileName);
                return {
                    readStream: rs,
                    // We currently don't store the content type of uploaded custom sounds when using
                    // The filesystem storage. We will use mime to infer its type from the extension.
                    contentType: with_db_1.default.lookup(fileName) || 'application/octet-stream',
                    length: stat.size,
                };
            }
            catch (error1) {
                console.error(error1);
            }
        });
    }
    getFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getFileWithReadStream(fileName);
            if (!file) {
                return;
            }
            return new Promise((resolve) => {
                const data = [];
                file.readStream.on('data', (chunk) => {
                    return data.push(chunk);
                });
                file.readStream.on('end', () => {
                    resolve({
                        buffer: Buffer.concat(data),
                        length: file.length,
                    });
                });
            });
        });
    }
    deleteFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.remove(fileName);
            }
            catch (error1) {
                console.error(error1);
            }
        });
    }
}
exports.RocketChatFile = {
    bufferToStream(buffer) {
        const bufferStream = new stream_1.default.PassThrough();
        bufferStream.end(buffer);
        return bufferStream;
    },
    dataURIParse(dataURI) {
        const imageData = Buffer.from(dataURI).toString().split(';base64,');
        return {
            image: imageData[1],
            contentType: imageData[0].replace('data:', ''),
        };
    },
    GridFS,
    FileSystem,
};
