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
exports.ConfigurableAppSourceStorage = void 0;
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
const AppFileSystemSourceStorage_1 = require("./AppFileSystemSourceStorage");
const AppGridFSSourceStorage_1 = require("./AppGridFSSourceStorage");
class ConfigurableAppSourceStorage extends storage_1.AppSourceStorage {
    constructor(storageType, filesystemStoragePath) {
        super();
        this.storageType = storageType;
        this.filesystem = new AppFileSystemSourceStorage_1.AppFileSystemSourceStorage();
        this.gridfs = new AppGridFSSourceStorage_1.AppGridFSSourceStorage();
        this.setStorage(storageType);
        this.setFileSystemStoragePath(filesystemStoragePath);
    }
    setStorage(type) {
        switch (type) {
            case 'filesystem':
                this.storage = this.filesystem;
                break;
            case 'gridfs':
                this.storage = this.gridfs;
                break;
        }
    }
    setFileSystemStoragePath(path) {
        this.filesystem.setPath(path);
    }
    store(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.store(item, zip);
        });
    }
    fetch(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.fetch(item);
        });
    }
    update(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.update(item, zip);
        });
    }
    remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.remove(item);
        });
    }
}
exports.ConfigurableAppSourceStorage = ConfigurableAppSourceStorage;
