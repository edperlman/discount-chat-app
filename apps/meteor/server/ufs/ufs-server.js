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
const domain_1 = __importDefault(require("domain"));
const fs_1 = __importDefault(require("fs"));
const stream_1 = __importDefault(require("stream"));
const url_1 = __importDefault(require("url"));
const zlib_1 = __importDefault(require("zlib"));
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const mkdirp_1 = __importDefault(require("mkdirp"));
const ufs_1 = require("./ufs");
meteor_1.Meteor.startup(() => {
    const path = ufs_1.UploadFS.config.tmpDir;
    const mode = ufs_1.UploadFS.config.tmpDirPermissions;
    fs_1.default.stat(path, (err) => {
        if (err) {
            // Create the temp directory
            (0, mkdirp_1.default)(path, { mode })
                .then(() => {
                console.log(`ufs: temp directory created at "${path}"`);
            })
                .catch((err) => {
                console.error(`ufs: cannot create temp directory at "${path}" (${err.message})`);
            });
        }
        else {
            // Set directory permissions
            fs_1.default.chmod(path, mode, (err) => {
                err && console.error(`ufs: cannot set temp directory permissions ${mode} (${err.message})`);
            });
        }
    });
});
// Create domain to handle errors
// and possibly avoid server crashes.
const d = domain_1.default.create();
d.on('error', (err) => {
    console.error(`ufs: ${err.message}`);
});
// Listen HTTP requests to serve files
webapp_1.WebApp.connectHandlers.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Quick check to see if request should be caught
    if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.includes(`/${ufs_1.UploadFS.config.storesPath}/`))) {
        next();
        return;
    }
    // Remove store path
    const parsedUrl = url_1.default.parse(req.url, true);
    const path = (_b = parsedUrl.pathname) === null || _b === void 0 ? void 0 : _b.substr(ufs_1.UploadFS.config.storesPath.length + 1);
    if (!path) {
        next();
        return;
    }
    const allowCORS = () => {
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    };
    if (req.method === 'OPTIONS') {
        const regExp = new RegExp('^/([^/?]+)/([^/?]+)$');
        const match = regExp.exec(path);
        // Request is not valid
        if (match === null) {
            res.writeHead(400);
            res.end();
            return;
        }
        // Get store
        const store = ufs_1.UploadFS.getStore(match[1]);
        if (!store) {
            res.writeHead(404);
            res.end();
            return;
        }
        // If a store is found, go ahead and allow the origin
        allowCORS();
        next();
    }
    else if (req.method === 'POST') {
        res.writeHead(404);
        res.end();
    }
    else if (req.method === 'GET') {
        // Get store, file Id and file name
        const regExp = new RegExp('^/([^/?]+)/([^/?]+)(?:/([^/?]+))?$');
        const match = regExp.exec(path);
        // Avoid 504 Gateway timeout error
        // if file is not handled by UploadFS.
        if (match === null) {
            next();
            return;
        }
        // Get store
        const storeName = match[1];
        const store = ufs_1.UploadFS.getStore(storeName);
        if (!store) {
            res.writeHead(404);
            res.end();
            return;
        }
        if (store.onRead !== null && store.onRead !== undefined && typeof store.onRead !== 'function') {
            console.error(`ufs: Store.onRead is not a function in store "${storeName}"`);
            res.writeHead(500);
            res.end();
            return;
        }
        // Remove file extension from file Id
        const index = match[2].indexOf('.');
        const fileId = index !== -1 ? match[2].substr(0, index) : match[2];
        // Get file from database
        const file = yield store.getCollection().findOne({ _id: fileId });
        if (!file) {
            res.writeHead(404);
            res.end();
            return;
        }
        yield d.run(() => __awaiter(void 0, void 0, void 0, function* () {
            // Check if the file can be accessed
            if ((yield store.onRead.call(store, fileId, file, req, res)) !== false) {
                const options = {};
                let status = 200;
                // Prepare response headers
                const headers = {
                    'Content-Type': file.type,
                    'Content-Length': file.size,
                };
                // Add ETag header
                if (typeof file.etag === 'string') {
                    headers.ETag = file.etag;
                }
                // Add Last-Modified header
                if (file.modifiedAt instanceof Date) {
                    headers['Last-Modified'] = file.modifiedAt.toUTCString();
                }
                else if (file.uploadedAt instanceof Date) {
                    headers['Last-Modified'] = file.uploadedAt.toUTCString();
                }
                // Parse request headers
                if (typeof req.headers === 'object') {
                    // Compare ETag
                    if (req.headers['if-none-match']) {
                        if (file.etag === req.headers['if-none-match']) {
                            res.writeHead(304); // Not Modified
                            res.end();
                            return;
                        }
                    }
                    // Compare file modification date
                    if (req.headers['if-modified-since']) {
                        const modifiedSince = new Date(req.headers['if-modified-since']);
                        if ((file.modifiedAt instanceof Date && file.modifiedAt > modifiedSince) ||
                            // eslint-disable-next-line no-mixed-operators
                            (file.uploadedAt instanceof Date && file.uploadedAt > modifiedSince)) {
                            res.writeHead(304); // Not Modified
                            res.end();
                            return;
                        }
                    }
                    // Support range request
                    if (typeof req.headers.range === 'string') {
                        const { range } = req.headers;
                        // Range is not valid
                        if (!range) {
                            res.writeHead(416);
                            res.end();
                            return;
                        }
                        const total = file.size || 0;
                        const unit = range.substr(0, range.indexOf('='));
                        if (unit !== 'bytes') {
                            res.writeHead(416);
                            res.end();
                            return;
                        }
                        const ranges = range
                            .substr(unit.length)
                            .replace(/[^0-9\-,]/, '')
                            .split(',');
                        if (ranges.length > 1) {
                            // todo: support multipart ranges: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
                        }
                        else {
                            const r = ranges[0].split('-');
                            const start = parseInt(r[0], 10);
                            const end = r[1] ? parseInt(r[1], 10) : total - 1;
                            // Range is not valid
                            if (start < 0 || end >= total || start > end) {
                                res.writeHead(416);
                                res.end();
                                return;
                            }
                            // Update headers
                            headers['Content-Range'] = `bytes ${start}-${end}/${total}`;
                            headers['Content-Length'] = end - start + 1;
                            options.start = start;
                            options.end = end;
                        }
                        status = 206; // partial content
                    }
                }
                else {
                    headers['Accept-Ranges'] = 'bytes';
                }
                // Open the file stream
                const rs = yield store.getReadStream(fileId, file, options);
                const ws = new stream_1.default.PassThrough();
                rs.on('error', (err) => {
                    store.onReadError.call(store, err, fileId, file);
                    res.end();
                });
                ws.on('error', (err) => {
                    store.onReadError.call(store, err, fileId, file);
                    res.end();
                });
                ws.on('close', () => {
                    // Close output stream at the end
                    ws.emit('end');
                });
                // Transform stream
                store.transformRead(rs, ws, fileId, file, req, headers);
                // Parse request headers
                if (typeof req.headers === 'object') {
                    // Compress data using if needed (ignore audio/video as they are already compressed)
                    if (typeof req.headers['accept-encoding'] === 'string' && (!file.type || !/^(audio|video)/.test(file.type))) {
                        const accept = req.headers['accept-encoding'];
                        // Compress with gzip
                        if (accept.match(/\bgzip\b/)) {
                            headers['Content-Encoding'] = 'gzip';
                            delete headers['Content-Length'];
                            res.writeHead(status, headers);
                            ws.pipe(zlib_1.default.createGzip()).pipe(res);
                            return;
                        }
                        // Compress with deflate
                        if (accept.match(/\bdeflate\b/)) {
                            headers['Content-Encoding'] = 'deflate';
                            delete headers['Content-Length'];
                            res.writeHead(status, headers);
                            ws.pipe(zlib_1.default.createDeflate()).pipe(res);
                            return;
                        }
                    }
                }
                // Send raw data
                if (!headers['Content-Encoding']) {
                    res.writeHead(status, headers);
                    ws.pipe(res);
                }
            }
            else {
                res.end();
            }
        }));
    }
    else {
        next();
    }
}));
