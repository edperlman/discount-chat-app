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
require("../../ufs/AmazonS3/server");
const get = function (file, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const forcedDownload = (0, helper_1.forceDownload)(req);
        const fileUrl = yield this.store.getRedirectURL(file, forcedDownload);
        if (!fileUrl || !file.store) {
            res.end();
            return;
        }
        const storeType = file.store.split(':').pop();
        if (server_1.settings.get(`FileUpload_S3_Proxy_${storeType}`)) {
            const request = /^https:/.test(fileUrl) ? https_1.default : http_1.default;
            FileUpload_1.FileUpload.proxyFile(file.name || '', fileUrl, forcedDownload, request, req, res);
            return;
        }
        FileUpload_1.FileUpload.redirectToFile(fileUrl, req, res);
    });
};
const copy = function (file, out) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileUrl = yield this.store.getRedirectURL(file);
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
const AmazonS3Uploads = new FileUpload_1.FileUploadClass({
    name: 'AmazonS3:Uploads',
    get,
    copy,
    // store setted bellow
});
const AmazonS3Avatars = new FileUpload_1.FileUploadClass({
    name: 'AmazonS3:Avatars',
    get,
    copy,
    // store setted bellow
});
const AmazonS3UserDataFiles = new FileUpload_1.FileUploadClass({
    name: 'AmazonS3:UserDataFiles',
    get,
    copy,
    // store setted bellow
});
const configure = underscore_1.default.debounce(() => {
    const Bucket = server_1.settings.get('FileUpload_S3_Bucket');
    const Acl = server_1.settings.get('FileUpload_S3_Acl');
    const AWSAccessKeyId = server_1.settings.get('FileUpload_S3_AWSAccessKeyId');
    const AWSSecretAccessKey = server_1.settings.get('FileUpload_S3_AWSSecretAccessKey');
    const URLExpiryTimeSpan = server_1.settings.get('FileUpload_S3_URLExpiryTimeSpan');
    const Region = server_1.settings.get('FileUpload_S3_Region');
    const SignatureVersion = server_1.settings.get('FileUpload_S3_SignatureVersion');
    const ForcePathStyle = server_1.settings.get('FileUpload_S3_ForcePathStyle');
    // const CDN = RocketChat.settings.get('FileUpload_S3_CDN');
    const BucketURL = server_1.settings.get('FileUpload_S3_BucketURL');
    if (!Bucket) {
        return;
    }
    const config = {
        connection: {
            signatureVersion: SignatureVersion,
            s3ForcePathStyle: ForcePathStyle,
            params: {
                Bucket,
                ACL: Acl,
            },
            region: Region,
        },
        URLExpiryTimeSpan,
    };
    if (AWSAccessKeyId) {
        config.connection.accessKeyId = AWSAccessKeyId;
    }
    if (AWSSecretAccessKey) {
        config.connection.secretAccessKey = AWSSecretAccessKey;
    }
    if (BucketURL) {
        config.connection.endpoint = BucketURL;
    }
    AmazonS3Uploads.store = FileUpload_1.FileUpload.configureUploadsStore('AmazonS3', AmazonS3Uploads.name, config);
    AmazonS3Avatars.store = FileUpload_1.FileUpload.configureUploadsStore('AmazonS3', AmazonS3Avatars.name, config);
    AmazonS3UserDataFiles.store = FileUpload_1.FileUpload.configureUploadsStore('AmazonS3', AmazonS3UserDataFiles.name, config);
}, 500);
server_1.settings.watchByRegex(/^FileUpload_S3_/, configure);
