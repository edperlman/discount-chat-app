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
exports.WebdavClientAdapter = void 0;
const stream_1 = __importDefault(require("stream"));
const webdav_1 = require("webdav");
class WebdavClientAdapter {
    constructor(serverConfig, cred) {
        if (cred.token) {
            this._client = (0, webdav_1.createClient)(serverConfig, { token: cred.token });
        }
        else {
            this._client = (0, webdav_1.createClient)(serverConfig, {
                username: cred.username,
                password: cred.password,
            });
        }
    }
    stat(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield this._client.stat(path);
            }
            catch (error) {
                throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) ? error.response.statusText : 'Error checking if directory exists on webdav');
            }
        });
    }
    createDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield this._client.createDirectory(path);
            }
            catch (error) {
                throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) ? error.response.statusText : 'Error creating directory on webdav');
            }
        });
    }
    deleteFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield this._client.deleteFile(path);
            }
            catch (error) {
                throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) ? error.response.statusText : 'Error deleting file on webdav');
            }
        });
    }
    getFileContents(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return (yield this._client.getFileContents(filename));
            }
            catch (error) {
                throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) ? error.response.statusText : 'Error getting file contents webdav');
            }
        });
    }
    getDirectoryContents(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield this._client.getDirectoryContents(path);
            }
            catch (error) {
                throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) ? error.response.statusText : 'Error getting directory contents webdav');
            }
        });
    }
    putFileContents(path_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (path, data, options = {}) {
            var _a, _b;
            try {
                return yield this._client.putFileContents(path, data, options);
            }
            catch (error) {
                throw new Error((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) !== null && _b !== void 0 ? _b : 'Error updating file contents.');
            }
        });
    }
    createReadStream(path, options) {
        return this._client.createReadStream(path, options);
    }
    createWriteStream(path, fileSize) {
        const ws = new stream_1.default.PassThrough();
        this._client
            .customRequest(path, {
            method: 'PUT',
            headers: Object.assign({}, (fileSize ? { 'Content-Length': String(fileSize) } : {})),
            data: ws,
            maxRedirects: 0,
        })
            .catch((err) => {
            ws.emit('error', err);
        });
        return ws;
    }
}
exports.WebdavClientAdapter = WebdavClientAdapter;
