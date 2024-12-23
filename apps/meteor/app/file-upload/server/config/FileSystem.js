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
const promises_1 = __importDefault(require("fs/promises"));
const helper_1 = require("./helper");
const ufs_1 = require("../../../../server/ufs");
const server_1 = require("../../../settings/server");
const FileUpload_1 = require("../lib/FileUpload");
const ranges_1 = require("../lib/ranges");
const FileSystemUploads = new FileUpload_1.FileUploadClass({
    name: 'FileSystem:Uploads',
    // store setted bellow
    get(file, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.store || !file) {
                return;
            }
            const filePath = yield this.store.getFilePath(file._id, file);
            const options = {};
            try {
                const stat = yield promises_1.default.stat(filePath);
                if (!(stat === null || stat === void 0 ? void 0 : stat.isFile())) {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                file = FileUpload_1.FileUpload.addExtensionTo(file);
                res.setHeader('Content-Disposition', `${(0, helper_1.getContentDisposition)(req)}; filename*=UTF-8''${encodeURIComponent(file.name || '')}`);
                file.uploadedAt && res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
                res.setHeader('Content-Type', file.type || 'application/octet-stream');
                if (req.headers.range) {
                    const range = (0, ranges_1.getFileRange)(file, req);
                    if (range) {
                        (0, ranges_1.setRangeHeaders)(range, file, res);
                        if (range.outOfRange) {
                            return;
                        }
                        options.start = range.start;
                        options.end = range.stop;
                    }
                }
                // set content-length if range has not set
                if (!res.getHeader('Content-Length')) {
                    res.setHeader('Content-Length', file.size || 0);
                }
                (yield this.store.getReadStream(file._id, file, options)).pipe(res);
            }
            catch (e) {
                res.writeHead(404);
                res.end();
            }
        });
    },
    copy(file, out) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.store) {
                return;
            }
            const filePath = yield this.store.getFilePath(file._id, file);
            try {
                const stat = yield promises_1.default.stat(filePath);
                if (stat === null || stat === void 0 ? void 0 : stat.isFile()) {
                    file = FileUpload_1.FileUpload.addExtensionTo(file);
                    (yield this.store.getReadStream(file._id, file)).pipe(out);
                }
            }
            catch (e) {
                out.end();
            }
        });
    },
});
const FileSystemAvatars = new FileUpload_1.FileUploadClass({
    name: 'FileSystem:Avatars',
    // store setted bellow
    get(file, _req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.store) {
                return;
            }
            const filePath = yield this.store.getFilePath(file._id, file);
            try {
                const stat = yield promises_1.default.stat(filePath);
                if (stat === null || stat === void 0 ? void 0 : stat.isFile()) {
                    file = FileUpload_1.FileUpload.addExtensionTo(file);
                    (yield this.store.getReadStream(file._id, file)).pipe(res);
                }
            }
            catch (e) {
                res.writeHead(404);
                res.end();
            }
        });
    },
});
const FileSystemUserDataFiles = new FileUpload_1.FileUploadClass({
    name: 'FileSystem:UserDataFiles',
    get(file, _req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.store) {
                return;
            }
            const filePath = yield this.store.getFilePath(file._id, file);
            try {
                const stat = yield promises_1.default.stat(filePath);
                if (stat === null || stat === void 0 ? void 0 : stat.isFile()) {
                    file = FileUpload_1.FileUpload.addExtensionTo(file);
                    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name || '')}`);
                    file.uploadedAt && res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
                    res.setHeader('Content-Type', file.type || '');
                    res.setHeader('Content-Length', file.size || 0);
                    (yield this.store.getReadStream(file._id, file)).pipe(res);
                }
            }
            catch (e) {
                res.writeHead(404);
                res.end();
            }
        });
    },
});
server_1.settings.watch('FileUpload_FileSystemPath', () => {
    const options = {
        path: server_1.settings.get('FileUpload_FileSystemPath'), // '/tmp/uploads/photos',
    };
    FileSystemUploads.store = FileUpload_1.FileUpload.configureUploadsStore('Local', FileSystemUploads.name, options);
    FileSystemAvatars.store = FileUpload_1.FileUpload.configureUploadsStore('Local', FileSystemAvatars.name, options);
    FileSystemUserDataFiles.store = FileUpload_1.FileUpload.configureUploadsStore('Local', FileSystemUserDataFiles.name, options);
    // DEPRECATED backwards compatibility (remove)
    ufs_1.UploadFS.getStores().fileSystem = ufs_1.UploadFS.getStores()[FileSystemUploads.name];
});
