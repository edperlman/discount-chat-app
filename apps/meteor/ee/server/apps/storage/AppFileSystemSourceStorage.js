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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFileSystemSourceStorage = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
class AppFileSystemSourceStorage extends storage_1.AppSourceStorage {
    constructor() {
        super(...arguments);
        this.pathPrefix = 'fs:/';
    }
    setPath(path) {
        this.path = path;
    }
    checkPath() {
        if (!this.path) {
            throw new Error('Invalid path configured for file system App storage');
        }
    }
    store(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkPath();
            const filePath = this.itemToFilename(item);
            yield fs_1.promises.writeFile(filePath, zip);
            return this.filenameToSourcePath(filePath);
        });
    }
    fetch(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item.sourcePath) {
                throw new Error('Invalid source path');
            }
            return fs_1.promises.readFile(this.sourcePathToFilename(item.sourcePath));
        });
    }
    update(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkPath();
            const filePath = this.itemToFilename(item);
            yield fs_1.promises.writeFile(filePath, zip);
            return this.filenameToSourcePath(filePath);
        });
    }
    remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item.sourcePath) {
                return;
            }
            return fs_1.promises.unlink(this.sourcePathToFilename(item.sourcePath));
        });
    }
    itemToFilename(item) {
        return `${(0, path_1.normalize)((0, path_1.join)(this.path, item.id))}.zip`;
    }
    filenameToSourcePath(filename) {
        return this.pathPrefix + filename;
    }
    sourcePathToFilename(sourcePath) {
        return sourcePath.substring(this.pathPrefix.length);
    }
}
exports.AppFileSystemSourceStorage = AppFileSystemSourceStorage;
