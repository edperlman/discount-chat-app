"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFS = void 0;
const random_1 = require("@rocket.chat/random");
const ufs_config_1 = require("./ufs-config");
const ufs_filter_1 = require("./ufs-filter");
const ufs_mime_1 = require("./ufs-mime");
const ufs_store_1 = require("./ufs-store");
const stores = {};
const store = {};
exports.UploadFS = {
    config: new ufs_config_1.Config(),
    store,
    addStore(store) {
        if (!(store instanceof ufs_store_1.Store)) {
            throw new TypeError('ufs: store is not an instance of UploadFS.Store.');
        }
        stores[store.getName()] = store;
    },
    generateEtag() {
        return random_1.Random.id();
    },
    getMimeType(extension) {
        extension = extension.toLowerCase();
        return ufs_mime_1.MIME[extension];
    },
    getMimeTypes() {
        return ufs_mime_1.MIME;
    },
    getStore(name) {
        return stores[name];
    },
    getStores() {
        return stores;
    },
    getTempFilePath(fileId) {
        return `${this.config.tmpDir}/${fileId}`;
    },
    Config: ufs_config_1.Config,
    Filter: ufs_filter_1.Filter,
    Store: ufs_store_1.Store,
};
