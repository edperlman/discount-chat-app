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
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const underscore_1 = __importDefault(require("underscore"));
const helper_1 = require("./helper");
const server_1 = require("../../../settings/server");
const FileUpload_1 = require("../lib/FileUpload");
require("../../ufs/GoogleStorage/server");
const get = function (file, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const forcedDownload = (0, helper_1.forceDownload)(req);
        const fileUrl = yield this.store.getRedirectURL(file, forcedDownload);
        if (!fileUrl || !file.store) {
            res.end();
            return;
        }
        const storeType = file.store.split(':').pop();
        if (server_1.settings.get(`FileUpload_GoogleStorage_Proxy_${storeType}`)) {
            const request = /^https:/.test(fileUrl) ? https_1.default : http_1.default;
            FileUpload_1.FileUpload.proxyFile(file.name || '', fileUrl, forcedDownload, request, req, res);
            return;
        }
        FileUpload_1.FileUpload.redirectToFile(fileUrl, req, res);
    });
};
const copy = function (file, out) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileUrl = yield this.store.getRedirectURL(file, false);
        if (!fileUrl) {
            out.end();
            return;
        }
        const request = /^https:/.test(fileUrl) ? https_1.default : http_1.default;
        return new Promise((resolve) => {
            request.get(fileUrl, (fileRes) => fileRes.pipe(out).on('finish', () => resolve()));
        });
    });
};
const GoogleCloudStorageUploads = new FileUpload_1.FileUploadClass({
    name: 'GoogleCloudStorage:Uploads',
    get,
    copy,
    // store setted bellow
});
const GoogleCloudStorageAvatars = new FileUpload_1.FileUploadClass({
    name: 'GoogleCloudStorage:Avatars',
    get,
    copy,
    // store setted bellow
});
const GoogleCloudStorageUserDataFiles = new FileUpload_1.FileUploadClass({
    name: 'GoogleCloudStorage:UserDataFiles',
    get,
    copy,
    // store setted bellow
});
const configure = underscore_1.default.debounce(() => {
    const bucket = server_1.settings.get('FileUpload_GoogleStorage_Bucket');
    const projectId = server_1.settings.get('FileUpload_GoogleStorage_ProjectId');
    const accessId = server_1.settings.get('FileUpload_GoogleStorage_AccessId');
    const secret = server_1.settings.get('FileUpload_GoogleStorage_Secret');
    const URLExpiryTimeSpan = server_1.settings.get('FileUpload_S3_URLExpiryTimeSpan');
    if (!bucket || !accessId || !secret) {
        return;
    }
    const config = {
        connection: {
            credentials: {
                client_email: accessId,
                private_key: secret,
            },
            projectId,
        },
        bucket,
        URLExpiryTimeSpan,
    };
    GoogleCloudStorageUploads.store = FileUpload_1.FileUpload.configureUploadsStore('GoogleStorage', GoogleCloudStorageUploads.name, config);
    GoogleCloudStorageAvatars.store = FileUpload_1.FileUpload.configureUploadsStore('GoogleStorage', GoogleCloudStorageAvatars.name, config);
    GoogleCloudStorageUserDataFiles.store = FileUpload_1.FileUpload.configureUploadsStore('GoogleStorage', GoogleCloudStorageUserDataFiles.name, config);
}, 500);
server_1.settings.watchByRegex(/^FileUpload_GoogleStorage_/, configure);
