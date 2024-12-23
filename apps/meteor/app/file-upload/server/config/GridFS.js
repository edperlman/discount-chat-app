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
const zlib_1 = __importDefault(require("zlib"));
const logger_1 = require("@rocket.chat/logger");
const helper_1 = require("./helper");
const ufs_1 = require("../../../../server/ufs");
const FileUpload_1 = require("../lib/FileUpload");
const ranges_1 = require("../lib/ranges");
const logger = new logger_1.Logger('FileUpload');
class ExtractRange extends stream_1.default.Transform {
    constructor(options) {
        super(options);
        this.start = options.start;
        this.stop = options.stop;
        this.bytes_read = 0;
    }
    _transform(chunk, _enc, cb) {
        if (this.bytes_read > this.stop) {
            // done reading
            this.end();
        }
        else if (this.bytes_read + chunk.length < this.start) {
            // this chunk is still before the start byte
        }
        else {
            let start;
            let stop;
            if (this.start <= this.bytes_read) {
                start = 0;
            }
            else {
                start = this.start - this.bytes_read;
            }
            if (this.stop - this.bytes_read + 1 < chunk.length) {
                stop = this.stop - this.bytes_read + 1;
            }
            else {
                stop = chunk.length;
            }
            const newchunk = chunk.slice(start, stop);
            this.push(newchunk);
        }
        this.bytes_read += chunk.length;
        cb();
    }
}
// code from: https://github.com/jalik/jalik-ufs/blob/master/ufs-server.js#L310
const readFromGridFS = function (storeName, fileId, file, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!storeName) {
            return;
        }
        const store = ufs_1.UploadFS.getStore(storeName);
        const rs = yield store.getReadStream(fileId, file);
        const ws = new stream_1.default.PassThrough();
        [rs, ws].forEach((stream) => stream.on('error', (err) => {
            store.onReadError.call(store, err, fileId, file);
            res.end();
        }));
        ws.on('close', () => {
            // Close output stream at the end
            ws.emit('end');
        });
        // Transform stream
        store.transformRead(rs, ws, fileId, file, req);
        const range = (0, ranges_1.getFileRange)(file, req);
        if (range) {
            (0, ranges_1.setRangeHeaders)(range, file, res);
            if (range.outOfRange) {
                return;
            }
            logger.debug('File upload extracting range');
            ws.pipe(new ExtractRange({ start: range.start, stop: range.stop })).pipe(res);
            return;
        }
        const accept = (Array.isArray(req.headers['accept-encoding']) ? req.headers['accept-encoding'][0] : req.headers['accept-encoding']) || '';
        // Compress data using gzip
        if (accept.match(/\bgzip\b/)) {
            res.setHeader('Content-Encoding', 'gzip');
            res.removeHeader('Content-Length');
            res.writeHead(200);
            ws.pipe(zlib_1.default.createGzip()).pipe(res);
            return;
        }
        // Compress data using deflate
        if (accept.match(/\bdeflate\b/)) {
            res.setHeader('Content-Encoding', 'deflate');
            res.removeHeader('Content-Length');
            res.writeHead(200);
            ws.pipe(zlib_1.default.createDeflate()).pipe(res);
            return;
        }
        res.writeHead(200);
        ws.pipe(res);
    });
};
const copyFromGridFS = function (storeName, fileId, file, out) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!storeName) {
            return;
        }
        const store = ufs_1.UploadFS.getStore(storeName);
        const rs = yield store.getReadStream(fileId, file);
        [rs, out].forEach((stream) => stream.on('error', (err) => {
            store.onReadError.call(store, err, fileId, file);
            out.end();
        }));
        rs.pipe(out);
    });
};
FileUpload_1.FileUpload.configureUploadsStore('GridFS', 'GridFS:Uploads', {
    collectionName: 'rocketchat_uploads',
});
FileUpload_1.FileUpload.configureUploadsStore('GridFS', 'GridFS:UserDataFiles', {
    collectionName: 'rocketchat_userDataFiles',
});
// DEPRECATED: backwards compatibility (remove)
ufs_1.UploadFS.getStores().rocketchat_uploads = ufs_1.UploadFS.getStores()['GridFS:Uploads'];
FileUpload_1.FileUpload.configureUploadsStore('GridFS', 'GridFS:Avatars', {
    collectionName: 'rocketchat_avatars',
});
new FileUpload_1.FileUploadClass({
    name: 'GridFS:Uploads',
    get(file, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            file = FileUpload_1.FileUpload.addExtensionTo(file);
            res.setHeader('Content-Disposition', `${(0, helper_1.getContentDisposition)(req)}; filename*=UTF-8''${encodeURIComponent(file.name || '')}`);
            file.uploadedAt && res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
            res.setHeader('Content-Type', file.type || 'application/octet-stream');
            res.setHeader('Content-Length', file.size || 0);
            yield readFromGridFS(file.store, file._id, file, req, res);
        });
    },
    copy(file, out) {
        return __awaiter(this, void 0, void 0, function* () {
            yield copyFromGridFS(file.store, file._id, file, out);
        });
    },
});
new FileUpload_1.FileUploadClass({
    name: 'GridFS:UserDataFiles',
    get(file, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            file = FileUpload_1.FileUpload.addExtensionTo(file);
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name || '')}`);
            file.uploadedAt && res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
            res.setHeader('Content-Type', file.type || '');
            res.setHeader('Content-Length', file.size || 0);
            yield readFromGridFS(file.store, file._id, file, req, res);
        });
    },
    copy(file, out) {
        return __awaiter(this, void 0, void 0, function* () {
            yield copyFromGridFS(file.store, file._id, file, out);
        });
    },
});
new FileUpload_1.FileUploadClass({
    name: 'GridFS:Avatars',
    get(file, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            file = FileUpload_1.FileUpload.addExtensionTo(file);
            yield readFromGridFS(file.store, file._id, file, req, res);
        });
    },
    copy(file, out) {
        return __awaiter(this, void 0, void 0, function* () {
            yield copyFromGridFS(file.store, file._id, file, out);
        });
    },
});
