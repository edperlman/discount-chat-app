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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const fs_1 = __importDefault(require("fs"));
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const _1 = require(".");
const ufs_filter_1 = require("./ufs-filter");
class Store {
    constructor(options) {
        options = Object.assign({ onCopyError: this.onCopyError, onFinishUpload: this.onFinishUpload, onRead: this.onRead, onReadError: this.onReadError, onValidate: this.onValidate, onWriteError: this.onWriteError }, options);
        if (_1.UploadFS.getStore(options.name)) {
            throw new TypeError('Store: name already exists');
        }
        if (options.onCopyError && typeof options.onCopyError !== 'function') {
            throw new TypeError('Store: onCopyError is not a function');
        }
        if (options.onFinishUpload && typeof options.onFinishUpload !== 'function') {
            throw new TypeError('Store: onFinishUpload is not a function');
        }
        if (options.onRead && typeof options.onRead !== 'function') {
            throw new TypeError('Store: onRead is not a function');
        }
        if (options.onReadError && typeof options.onReadError !== 'function') {
            throw new TypeError('Store: onReadError is not a function');
        }
        if (options.onWriteError && typeof options.onWriteError !== 'function') {
            throw new TypeError('Store: onWriteError is not a function');
        }
        if (options.transformRead && typeof options.transformRead !== 'function') {
            throw new TypeError('Store: transformRead is not a function');
        }
        if (options.transformWrite && typeof options.transformWrite !== 'function') {
            throw new TypeError('Store: transformWrite is not a function');
        }
        if (options.onValidate && typeof options.onValidate !== 'function') {
            throw new TypeError('Store: onValidate is not a function');
        }
        // Public attributes
        this.options = options;
        if (options.onCopyError)
            this.onCopyError = options.onCopyError;
        if (options.onFinishUpload)
            this.onFinishUpload = options.onFinishUpload;
        if (options.onRead)
            this.onRead = options.onRead;
        if (options.onReadError)
            this.onReadError = options.onReadError;
        if (options.onWriteError)
            this.onWriteError = options.onWriteError;
        if (options.onValidate)
            this.onValidate = options.onValidate;
        // Add the store to the list
        _1.UploadFS.addStore(this);
        this.copy = (fileId, store, callback) => __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(fileId, String);
            if (!(store instanceof Store)) {
                throw new TypeError('store is not an instance of UploadFS.Store');
            }
            // Get original file
            const file = yield this.getCollection().findOne({ _id: fileId });
            if (!file) {
                throw new meteor_1.Meteor.Error('file-not-found', 'File not found');
            }
            // Silently ignore the file if it does not match filter
            const filter = store.getFilter();
            if (filter instanceof ufs_filter_1.Filter && !(yield filter.isValid(file))) {
                return;
            }
            // Prepare copy
            const { _id, url } = file, copy = __rest(file, ["_id", "url"]);
            copy.originalStore = this.getName();
            copy.originalId = fileId;
            // Create the copy
            const copyId = yield store.create(copy);
            // Get original stream
            const rs = yield this.getReadStream(fileId, file);
            // Catch errors to avoid app crashing
            rs.on('error', (err) => {
                callback === null || callback === void 0 ? void 0 : callback.call(this, err);
            });
            // Copy file data
            yield store.write(rs, copyId, (err) => {
                if (err) {
                    void this.removeById(copyId);
                    this.onCopyError.call(this, err, fileId, file);
                }
                if (typeof callback === 'function') {
                    callback.call(this, err, copyId, copy, store);
                }
            });
        });
        this.create = (file) => __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(file, Object);
            file.store = this.options.name; // assign store to file
            return (yield this.getCollection().insertOne(file)).insertedId;
        });
        this.write = (rs, fileId, callback) => __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getCollection().findOne({ _id: fileId });
            if (!file) {
                return callback(new Error('File not found'));
            }
            const errorHandler = (err) => {
                this.onWriteError.call(this, err, fileId, file);
                callback.call(this, err);
            };
            const finishHandler = () => __awaiter(this, void 0, void 0, function* () {
                let size = 0;
                const readStream = yield this.getReadStream(fileId, file);
                readStream.on('error', (error) => {
                    callback.call(this, error);
                });
                readStream.on('data', (data) => {
                    size += data.length;
                });
                readStream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    if (file.complete) {
                        return;
                    }
                    // Set file attribute
                    file.complete = true;
                    file.etag = _1.UploadFS.generateEtag();
                    file.path = yield this.getFileRelativeURL(fileId);
                    file.progress = 1;
                    file.size = size;
                    file.token = this.generateToken();
                    file.uploading = false;
                    file.uploadedAt = new Date();
                    file.url = yield this.getFileURL(fileId);
                    // Execute callback
                    if (typeof this.onFinishUpload === 'function') {
                        yield this.onFinishUpload.call(this, file);
                    }
                    // Sets the file URL when file transfer is complete,
                    // this way, the image will loads entirely.
                    yield this.getCollection().updateOne({ _id: fileId }, {
                        $set: {
                            complete: file.complete,
                            etag: file.etag,
                            path: file.path,
                            progress: file.progress,
                            size: file.size,
                            token: file.token,
                            uploading: file.uploading,
                            uploadedAt: file.uploadedAt,
                            url: file.url,
                        },
                    });
                    // Return file info
                    callback.call(this, undefined, file);
                }));
            });
            const ws = yield this.getWriteStream(fileId, file);
            ws.on('error', errorHandler);
            ws.once('finish', finishHandler);
            // Execute transformation
            this.transformWrite(rs, ws, fileId, file);
        });
    }
    removeById(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete the physical file in the store
            yield this.delete(fileId);
            const tmpFile = _1.UploadFS.getTempFilePath(fileId);
            // Delete the temp file
            fs_1.default.stat(tmpFile, (err) => {
                !err &&
                    fs_1.default.unlink(tmpFile, (err2) => {
                        err2 && console.error(`ufs: cannot delete temp file at ${tmpFile} (${err2.message})`);
                    });
            });
            yield this.getCollection().removeById(fileId);
        });
    }
    delete(_fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('delete is not implemented');
        });
    }
    generateToken(pattern) {
        return (pattern || 'xyxyxyxyxy').replace(/[xy]/g, (c) => {
            // eslint-disable-next-line no-mixed-operators
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            const s = v.toString(16);
            return Math.round(Math.random()) ? s.toUpperCase() : s;
        });
    }
    getCollection() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.options.collection;
    }
    getFilePath(_fileId, _file) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Store.getFilePath is not implemented');
        });
    }
    getFileRelativeURL(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getCollection().findOne(fileId, { projection: { name: 1 } });
            return file ? this.getRelativeURL(`${fileId}/${file.name}`) : undefined;
        });
    }
    getFileURL(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getCollection().findOne(fileId, { projection: { name: 1 } });
            return file ? this.getURL(`${fileId}/${file.name}`) : undefined;
        });
    }
    getFilter() {
        return this.options.filter;
    }
    getName() {
        return this.options.name;
    }
    getReadStream(_fileId, _file, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Store.getReadStream is not implemented');
        });
    }
    getRelativeURL(path) {
        const rootUrl = meteor_1.Meteor.absoluteUrl().replace(/\/+$/, '');
        const rootPath = rootUrl.replace(/^[a-z]+:\/\/[^/]+\/*/gi, '');
        const storeName = this.getName();
        path = String(path).replace(/\/$/, '').trim();
        return encodeURI(`${rootPath}/${_1.UploadFS.config.storesPath}/${storeName}/${path}`);
    }
    getURL(path) {
        const rootUrl = meteor_1.Meteor.absoluteUrl('', { secure: _1.UploadFS.config.https }).replace(/\/+$/, '');
        const storeName = this.getName();
        path = String(path).replace(/\/$/, '').trim();
        return encodeURI(`${rootUrl}/${_1.UploadFS.config.storesPath}/${storeName}/${path}`);
    }
    getRedirectURL(_file_1) {
        return __awaiter(this, arguments, void 0, function* (_file, _forceDownload = false) {
            throw new Error('getRedirectURL is not implemented');
        });
    }
    getWriteStream(_fileId, _file) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getWriteStream is not implemented');
        });
    }
    onCopyError(err, fileId, _file) {
        console.error(`ufs: cannot copy file "${fileId}" (${err.message})`, err);
    }
    onFinishUpload(_file) {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    onRead(_fileId, _file, _request, _response) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    onReadError(err, fileId, _file) {
        console.error(`ufs: cannot read file "${fileId}" (${err.message})`, err);
    }
    onValidate(_file) {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    onWriteError(err, fileId, _file) {
        console.error(`ufs: cannot write file "${fileId}" (${err.message})`, err);
    }
    transformRead(readStream, writeStream, fileId, file, request, headers) {
        if (typeof this.options.transformRead === 'function') {
            this.options.transformRead.call(this, readStream, writeStream, fileId, file, request, headers);
        }
        else {
            readStream.pipe(writeStream);
        }
    }
    transformWrite(readStream, writeStream, fileId, file) {
        if (typeof this.options.transformWrite === 'function') {
            this.options.transformWrite.call(this, readStream, writeStream, fileId, file);
        }
        else {
            readStream.pipe(writeStream);
        }
    }
    validate(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.onValidate === 'function') {
                yield this.onValidate(file);
            }
        });
    }
}
exports.Store = Store;
