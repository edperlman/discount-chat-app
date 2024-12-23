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
const underscore_1 = __importDefault(require("underscore"));
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const FileUpload_1 = require("../lib/FileUpload");
require("../../ufs/Webdav/server");
const get = function (file, _req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (yield this.store.getReadStream(file._id, file))
            .on('error', () => {
            system_1.SystemLogger.error('An error ocurred when fetching the file');
            res.writeHead(503);
            res.end();
        })
            .on('data', (chunk) => {
            res.write(chunk);
        })
            .on('end', res.end.bind(res));
    });
};
const copy = function (file, out) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            (yield this.store.getReadStream(file._id, file)).pipe(out).on('finish', () => resolve());
        }));
    });
};
const WebdavUploads = new FileUpload_1.FileUploadClass({
    name: 'Webdav:Uploads',
    get,
    copy,
    // store setted bellow
});
const WebdavAvatars = new FileUpload_1.FileUploadClass({
    name: 'Webdav:Avatars',
    get,
    copy,
    // store setted bellow
});
const WebdavUserDataFiles = new FileUpload_1.FileUploadClass({
    name: 'Webdav:UserDataFiles',
    get,
    copy,
    // store setted bellow
});
const configure = underscore_1.default.debounce(() => {
    const uploadFolderPath = server_1.settings.get('FileUpload_Webdav_Upload_Folder_Path');
    const server = server_1.settings.get('FileUpload_Webdav_Server_URL');
    const username = server_1.settings.get('FileUpload_Webdav_Username');
    const password = server_1.settings.get('FileUpload_Webdav_Password');
    if (!server || !username || !password) {
        return;
    }
    const config = {
        connection: {
            credentials: {
                server,
                username,
                password,
            },
        },
        uploadFolderPath,
    };
    WebdavUploads.store = FileUpload_1.FileUpload.configureUploadsStore('Webdav', WebdavUploads.name, config);
    WebdavAvatars.store = FileUpload_1.FileUpload.configureUploadsStore('Webdav', WebdavAvatars.name, config);
    WebdavUserDataFiles.store = FileUpload_1.FileUpload.configureUploadsStore('Webdav', WebdavUserDataFiles.name, config);
}, 500);
server_1.settings.watchByRegex(/^FileUpload_Webdav_/, configure);
