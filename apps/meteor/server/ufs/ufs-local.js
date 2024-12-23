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
exports.LocalStore = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const mkdirp_1 = __importDefault(require("mkdirp"));
const ufs_1 = require("./ufs");
const ufs_store_1 = require("./ufs-store");
class LocalStore extends ufs_store_1.Store {
    constructor(options) {
        // Default options
        options = Object.assign({ mode: '0744', path: 'ufs/uploads', writeMode: 0o744 }, options);
        // Check options
        if (typeof options.mode !== 'string') {
            throw new TypeError('LocalStore: mode is not a string');
        }
        if (typeof options.path !== 'string') {
            throw new TypeError('LocalStore: path is not a string');
        }
        if (typeof options.writeMode !== 'number') {
            throw new TypeError('LocalStore: writeMode is not a string');
        }
        super(options);
        // Private attributes
        const { mode } = options;
        const { path } = options;
        const { writeMode } = options;
        fs_1.default.stat(path, (err) => {
            if (err) {
                // Create the directory
                (0, mkdirp_1.default)(path, { mode })
                    .then(() => {
                    console.info(`LocalStore: store created at ${path}`);
                })
                    .catch((err) => {
                    console.error(`LocalStore: cannot create store at ${path} (${err.message})`);
                });
            }
            else {
                // Set directory permissions
                fs_1.default.chmod(path, mode, (err) => {
                    err && console.error(`LocalStore: cannot set store permissions ${mode} (${err.message})`);
                });
            }
        });
        this.getPath = function (file) {
            return path + (file ? `/${file}` : '');
        };
        this.delete = (fileId) => __awaiter(this, void 0, void 0, function* () {
            const path = yield this.getFilePath(fileId);
            try {
                if (!(yield (0, promises_1.stat)(path)).isFile()) {
                    return;
                }
            }
            catch (_e) {
                // FIXME(user) don't ignore, rather this block shouldn't run twice like it does now
                return;
            }
            yield (0, promises_1.unlink)(path);
            yield this.removeById(fileId);
        });
        this.getReadStream = (fileId, file, options) => __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({}, options);
            return fs_1.default.createReadStream(yield this.getFilePath(fileId, file), {
                flags: 'r',
                encoding: undefined,
                autoClose: true,
                start: options.start,
                end: options.end,
            });
        });
        this.getWriteStream = (fileId, file, options) => __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({}, options);
            return fs_1.default.createWriteStream(yield this.getFilePath(fileId, file), {
                flags: 'a',
                encoding: undefined,
                mode: writeMode,
                start: options.start,
            });
        });
    }
    getFilePath(fileId, fileParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = fileParam || (yield this.getCollection().findOne(fileId, { projection: { extension: 1 } }));
            return (file && this.getPath(fileId + (file.extension ? `.${file.extension}` : ''))) || '';
        });
    }
}
exports.LocalStore = LocalStore;
// Add store to UFS namespace
ufs_1.UploadFS.store.Local = LocalStore;
