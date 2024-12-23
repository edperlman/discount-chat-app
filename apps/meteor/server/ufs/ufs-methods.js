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
exports.ufsComplete = ufsComplete;
const fs_1 = __importDefault(require("fs"));
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const ufs_1 = require("./ufs");
function ufsComplete(fileId, storeName) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, check_1.check)(fileId, String);
        (0, check_1.check)(storeName, String);
        // Get store
        const store = ufs_1.UploadFS.getStore(storeName);
        if (!store) {
            throw new meteor_1.Meteor.Error('invalid-store', 'Store not found');
        }
        const tmpFile = ufs_1.UploadFS.getTempFilePath(fileId);
        const removeTempFile = function () {
            fs_1.default.stat(tmpFile, (err) => {
                !err &&
                    fs_1.default.unlink(tmpFile, (err2) => {
                        err2 && console.error(`ufs: cannot delete temp file "${tmpFile}" (${err2.message})`);
                    });
            });
        };
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                // todo check if temp file exists
                // Get file
                const file = yield store.getCollection().findOne({ _id: fileId });
                if (!file) {
                    throw new meteor_1.Meteor.Error('invalid-file', 'File is not valid');
                }
                // Validate file before moving to the store
                yield store.validate(file);
                // Get the temp file
                const rs = fs_1.default.createReadStream(tmpFile, {
                    flags: 'r',
                    encoding: undefined,
                    autoClose: true,
                });
                // Clean upload if error occurs
                rs.on('error', (err) => {
                    console.error(err);
                    void store.removeById(fileId);
                    reject(err);
                });
                // Save file in the store
                yield store.write(rs, fileId, (err, file) => {
                    removeTempFile();
                    if (err) {
                        return reject(err);
                    }
                    if (!file) {
                        return reject(new Error('Unknown error writing file'));
                    }
                    resolve(file);
                });
            }
            catch (err) {
                // If write failed, remove the file
                yield store.removeById(fileId);
                // removeTempFile(); // todo remove temp file on error or try again ?
                reject(new meteor_1.Meteor.Error('ufs: cannot upload file', err));
            }
        }));
    });
}
