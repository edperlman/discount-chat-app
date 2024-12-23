"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
const system_1 = require("../../../../server/lib/logger/system");
const ufs_1 = require("../../../../server/ufs");
const server_1 = require("../../../settings/server");
require("./AmazonS3");
require("./FileSystem");
require("./GoogleStorage");
require("./GridFS");
require("./Webdav");
const configStore = underscore_1.default.debounce(() => {
    const store = server_1.settings.get('FileUpload_Storage_Type');
    if (store) {
        system_1.SystemLogger.info(`Setting default file store to ${store}`);
        ufs_1.UploadFS.getStores().Avatars = ufs_1.UploadFS.getStore(`${store}:Avatars`);
        ufs_1.UploadFS.getStores().Uploads = ufs_1.UploadFS.getStore(`${store}:Uploads`);
        ufs_1.UploadFS.getStores().UserDataFiles = ufs_1.UploadFS.getStore(`${store}:UserDataFiles`);
    }
}, 1000);
server_1.settings.watchByRegex(/^FileUpload_/, configStore);
