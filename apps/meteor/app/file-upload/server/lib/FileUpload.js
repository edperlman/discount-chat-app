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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadClass = exports.FileUpload = void 0;
const buffer_1 = require("buffer");
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const stream_1 = __importDefault(require("stream"));
const url_1 = __importDefault(require("url"));
const account_utils_1 = require("@rocket.chat/account-utils");
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const filesize_1 = __importDefault(require("filesize"));
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const ostrio_cookies_1 = require("meteor/ostrio:cookies");
const sharp_1 = __importDefault(require("sharp"));
const stream_buffers_1 = __importDefault(require("stream-buffers"));
const streamToBuffer_1 = require("./streamToBuffer");
const i18n_1 = require("../../../../server/lib/i18n");
const system_1 = require("../../../../server/lib/logger/system");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const ufs_1 = require("../../../../server/ufs");
const ufs_methods_1 = require("../../../../server/ufs/ufs-methods");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const server_1 = require("../../../settings/server");
const mimeTypes_1 = require("../../../utils/lib/mimeTypes");
const JWTHelper_1 = require("../../../utils/server/lib/JWTHelper");
const restrictions_1 = require("../../../utils/server/restrictions");
const cookie = new ostrio_cookies_1.Cookies();
let maxFileSize = 0;
server_1.settings.watch('FileUpload_MaxFileSize', (value) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        maxFileSize = parseInt(value);
    }
    catch (e) {
        maxFileSize = (_a = (yield models_1.Settings.findOneById('FileUpload_MaxFileSize'))) === null || _a === void 0 ? void 0 : _a.packageValue;
    }
}));
const handlers = {};
const defaults = {
    Uploads() {
        return {
            collection: models_1.Uploads,
            filter: new ufs_1.UploadFS.Filter({
                onCheck: exports.FileUpload.validateFileUpload,
            }),
            getPath(file) {
                return `${server_1.settings.get('uniqueID')}/uploads/${file.rid}/${file.userId}/${file._id}`;
            },
            onValidate: exports.FileUpload.uploadsOnValidate,
            onRead(_fileId, file, req, res) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Deprecated: Remove support to usf path
                    if (!(yield exports.FileUpload.requestCanAccessFiles(req, file))) {
                        res.writeHead(403);
                        return false;
                    }
                    res.setHeader('content-disposition', `attachment; filename="${encodeURIComponent(file.name || '')}"`);
                    return true;
                });
            },
        };
    },
    Avatars() {
        return {
            collection: models_1.Avatars,
            filter: new ufs_1.UploadFS.Filter({
                onCheck: exports.FileUpload.validateAvatarUpload,
            }),
            getPath(file) {
                const avatarFile = file.rid ? `room-${file.rid}` : file.userId;
                return `${server_1.settings.get('uniqueID')}/avatars/${avatarFile}`;
            },
            onValidate: exports.FileUpload.avatarsOnValidate,
            onFinishUpload: exports.FileUpload.avatarsOnFinishUpload,
        };
    },
    UserDataFiles() {
        return {
            collection: models_1.UserDataFiles,
            getPath(file) {
                return `${server_1.settings.get('uniqueID')}/uploads/userData/${file.userId}`;
            },
            onValidate: exports.FileUpload.uploadsOnValidate,
            onRead(_fileId, file, req, res) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!(yield exports.FileUpload.requestCanAccessFiles(req))) {
                        res.writeHead(403);
                        return false;
                    }
                    res.setHeader('content-disposition', `attachment; filename="${encodeURIComponent(file.name || '')}"`);
                    return true;
                });
            },
        };
    },
};
exports.FileUpload = {
    handlers,
    getPath(path = '') {
        return `/file-upload/${path}`;
    },
    configureUploadsStore(store, name, options) {
        const type = name.split(':').pop();
        if (!type || !(type in exports.FileUpload.defaults)) {
            throw new Error('Store type undefined');
        }
        const stores = ufs_1.UploadFS.getStores();
        delete stores[name];
        return new ufs_1.UploadFS.store[store](Object.assign({
            name,
        }, options, exports.FileUpload.defaults[type]()));
    },
    validateFileUpload(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!check_1.Match.test(file.rid, String)) {
                return false;
            }
            // livechat users can upload files but they don't have an userId
            const user = (file.userId && (yield models_1.Users.findOne(file.userId))) || undefined;
            const room = yield models_1.Rooms.findOneById(file.rid);
            if (!room) {
                return false;
            }
            const directMessageAllowed = server_1.settings.get('FileUpload_Enabled_Direct');
            const fileUploadAllowed = server_1.settings.get('FileUpload_Enabled');
            if ((user === null || user === void 0 ? void 0 : user.type) !== 'app' && (yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user, file)) !== true) {
                return false;
            }
            const language = (user === null || user === void 0 ? void 0 : user.language) || 'en';
            if (!fileUploadAllowed) {
                const reason = i18n_1.i18n.t('FileUpload_Disabled', { lng: language });
                throw new meteor_1.Meteor.Error('error-file-upload-disabled', reason);
            }
            if (!directMessageAllowed && room.t === 'd') {
                const reason = i18n_1.i18n.t('File_not_allowed_direct_messages', { lng: language });
                throw new meteor_1.Meteor.Error('error-direct-message-file-upload-not-allowed', reason);
            }
            // -1 maxFileSize means there is no limit
            if (maxFileSize > -1 && (file.size || 0) > maxFileSize) {
                const reason = i18n_1.i18n.t('File_exceeds_allowed_size_of_bytes', {
                    size: (0, filesize_1.default)(maxFileSize),
                    lng: language,
                });
                throw new meteor_1.Meteor.Error('error-file-too-large', reason);
            }
            if (!server_1.settings.get('E2E_Enable_Encrypt_Files') && (0, core_typings_1.isE2EEUpload)(file)) {
                const reason = i18n_1.i18n.t('Encrypted_file_not_allowed', { lng: language });
                throw new meteor_1.Meteor.Error('error-invalid-file-type', reason);
            }
            // E2EE files should be of type application/octet-stream. no information about them should be disclosed on upload if they are encrypted
            if ((0, core_typings_1.isE2EEUpload)(file)) {
                file.type = 'application/octet-stream';
            }
            // E2EE files are of type application/octet-stream, which is whitelisted for E2EE files
            if (!(0, restrictions_1.fileUploadIsValidContentType)(file === null || file === void 0 ? void 0 : file.type, (0, core_typings_1.isE2EEUpload)(file) ? 'application/octet-stream' : undefined)) {
                const reason = i18n_1.i18n.t('File_type_is_not_accepted', { lng: language });
                throw new meteor_1.Meteor.Error('error-invalid-file-type', reason);
            }
            // App IPreFileUpload event hook
            try {
                yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPreFileUpload, { file, content: content || buffer_1.Buffer.from([]) }));
            }
            catch (error) {
                if (error.name === exceptions_1.AppsEngineException.name) {
                    throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
                }
                throw error;
            }
            return true;
        });
    },
    validateAvatarUpload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!check_1.Match.test(file.rid, String) && !check_1.Match.test(file.userId, String)) {
                return false;
            }
            const user = file.uid ? yield models_1.Users.findOne(file.uid, { projection: { language: 1 } }) : null;
            const language = (user === null || user === void 0 ? void 0 : user.language) || 'en';
            // accept only images
            if (!/^image\//.test(file.type || '')) {
                const reason = i18n_1.i18n.t('File_type_is_not_accepted', { lng: language });
                throw new meteor_1.Meteor.Error('error-invalid-file-type', reason);
            }
            // -1 maxFileSize means there is no limit
            if (maxFileSize > -1 && (file.size || 0) > maxFileSize) {
                const reason = i18n_1.i18n.t('File_exceeds_allowed_size_of_bytes', {
                    size: (0, filesize_1.default)(maxFileSize),
                    lng: language,
                });
                throw new meteor_1.Meteor.Error('error-file-too-large', reason);
            }
            return true;
        });
    },
    defaults,
    avatarsOnValidate(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('Accounts_AvatarResize') !== true) {
                return;
            }
            const tempFilePath = ufs_1.UploadFS.getTempFilePath(file._id);
            const height = server_1.settings.get('Accounts_AvatarSize');
            const width = height;
            const s = (0, sharp_1.default)(tempFilePath);
            if (server_1.settings.get('FileUpload_RotateImages') === true) {
                s.rotate();
            }
            const metadata = yield s.metadata();
            // if (!metadata) {
            // 	metadata = {};
            // }
            const { data, info } = yield s
                .resize({
                width,
                height,
                fit: metadata.hasAlpha ? sharp_1.default.fit.contain : sharp_1.default.fit.cover,
                background: { r: 255, g: 255, b: 255, alpha: metadata.hasAlpha ? 0 : 1 },
            })
                // Use buffer to get the result in memory then replace the existing file
                // There is no option to override a file using this library
                //
                // BY THE SHARP DOCUMENTATION:
                // toBuffer: Write output to a Buffer. JPEG, PNG, WebP, TIFF and RAW output are supported.
                // By default, the format will match the input image, except GIF and SVG input which become PNG output.
                .toBuffer({ resolveWithObject: true });
            try {
                yield (0, promises_1.writeFile)(tempFilePath, data);
            }
            catch (err) {
                system_1.SystemLogger.error(err);
            }
            yield this.getCollection().updateOne({ _id: file._id }, {
                $set: Object.assign({ size: info.size }, (['gif', 'svg'].includes(metadata.format || '') ? { type: 'image/png' } : {})),
            });
        });
    },
    resizeImagePreview(fileParam) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield models_1.Uploads.findOneById(fileParam._id);
            if (!file) {
                return;
            }
            file = exports.FileUpload.addExtensionTo(file);
            const image = yield exports.FileUpload.getStore('Uploads')._store.getReadStream(file._id, file);
            const transformer = (0, sharp_1.default)().resize({ width: 32, height: 32, fit: 'inside' }).jpeg().blur();
            const result = transformer.toBuffer().then((out) => out.toString('base64'));
            image.pipe(transformer);
            return result;
        });
    },
    extractMetadata(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, sharp_1.default)(yield exports.FileUpload.getBuffer(file)).metadata();
        });
    },
    createImageThumbnail(fileParam) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!server_1.settings.get('Message_Attachments_Thumbnails_Enabled')) {
                return;
            }
            const width = server_1.settings.get('Message_Attachments_Thumbnails_Width');
            const height = server_1.settings.get('Message_Attachments_Thumbnails_Height');
            if (((_a = fileParam.identify) === null || _a === void 0 ? void 0 : _a.size) && fileParam.identify.size.height < height && ((_b = fileParam.identify) === null || _b === void 0 ? void 0 : _b.size.width) < width) {
                return;
            }
            let file = yield models_1.Uploads.findOneById(fileParam._id);
            if (!file) {
                return;
            }
            file = exports.FileUpload.addExtensionTo(file);
            const store = exports.FileUpload.getStore('Uploads');
            const image = yield store._store.getReadStream(file._id, file);
            let transformer = (0, sharp_1.default)().resize({ width, height, fit: 'inside' });
            if (file.type === 'image/svg+xml') {
                transformer = transformer.png();
            }
            const result = transformer.toBuffer({ resolveWithObject: true }).then(({ data, info: { width, height, format } }) => ({
                data,
                width,
                height,
                thumbFileType: mimeTypes_1.mime.lookup(format) || '',
                thumbFileName: file === null || file === void 0 ? void 0 : file.name,
                originalFileId: file === null || file === void 0 ? void 0 : file._id,
            }));
            image.pipe(transformer);
            return result;
        });
    },
    uploadImageThumbnail(_a, buffer_2, rid_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* ({ thumbFileName, thumbFileType, originalFileId }, buffer, rid, userId) {
            const store = exports.FileUpload.getStore('Uploads');
            const details = {
                name: `thumb-${thumbFileName}`,
                size: buffer.length,
                type: thumbFileType,
                originalFileId,
                typeGroup: 'thumb',
                uploadedAt: new Date(),
                _updatedAt: new Date(),
                rid,
                userId,
            };
            return store.insert(details, buffer);
        });
    },
    uploadsOnValidate(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.type || !/^image\/((x-windows-)?bmp|p?jpeg|png|gif|webp)$/.test(file.type)) {
                return;
            }
            const tmpFile = ufs_1.UploadFS.getTempFilePath(file._id);
            const s = (0, sharp_1.default)(tmpFile);
            const metadata = yield s.metadata();
            // if (err != null) {
            // 	SystemLogger.error(err);
            // 	return fut.return();
            // }
            const rotated = typeof metadata.orientation !== 'undefined' && metadata.orientation !== 1;
            const width = rotated ? metadata.height : metadata.width;
            const height = rotated ? metadata.width : metadata.height;
            const identify = {
                format: metadata.format,
                size: width != null && height != null
                    ? {
                        width,
                        height,
                    }
                    : undefined,
            };
            const reorientation = () => __awaiter(this, void 0, void 0, function* () {
                if (!rotated || server_1.settings.get('FileUpload_RotateImages') !== true) {
                    return;
                }
                yield s.rotate().toFile(`${tmpFile}.tmp`);
                yield (0, promises_1.unlink)(tmpFile);
                yield (0, promises_1.rename)(`${tmpFile}.tmp`, tmpFile);
                // SystemLogger.error(err);
            });
            yield reorientation();
            const { size } = yield fs_1.default.lstatSync(tmpFile);
            yield this.getCollection().updateOne({ _id: file._id }, {
                $set: { size, identify },
            });
        });
    },
    avatarsOnFinishUpload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.rid) {
                return;
            }
            if (!file.userId) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Change avatar is not allowed');
            }
            // update file record to match user's username
            const user = yield models_1.Users.findOneById(file.userId);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Change avatar is not allowed');
            }
            const oldAvatar = yield models_1.Avatars.findOneByName(user.username);
            if (oldAvatar) {
                yield models_1.Avatars.deleteFile(oldAvatar._id);
            }
            yield models_1.Avatars.updateFileNameById(file._id, user.username);
        });
    },
    requestCanAccessFiles(_a, file_1) {
        return __awaiter(this, arguments, void 0, function* ({ headers = {}, url }, file) {
            if (!url || !server_1.settings.get('FileUpload_ProtectFiles')) {
                return true;
            }
            const { query } = url_1.default.parse(url, true);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let { rc_uid, rc_token, rc_rid, rc_room_type } = query;
            const { token } = query;
            if (!rc_uid && headers.cookie) {
                rc_uid = cookie.get('rc_uid', headers.cookie);
                rc_token = cookie.get('rc_token', headers.cookie);
                rc_rid = cookie.get('rc_rid', headers.cookie);
                rc_room_type = cookie.get('rc_room_type', headers.cookie);
            }
            const isAuthorizedByRoom = () => __awaiter(this, void 0, void 0, function* () {
                return rc_room_type &&
                    roomCoordinator_1.roomCoordinator
                        .getRoomDirectives(rc_room_type)
                        .canAccessUploadedFile({ rc_uid: rc_uid || '', rc_rid: rc_rid || '', rc_token: rc_token || '' });
            });
            const isAuthorizedByJWT = () => server_1.settings.get('FileUpload_Enable_json_web_token_for_files') &&
                token &&
                (0, JWTHelper_1.isValidJWT)(token, server_1.settings.get('FileUpload_json_web_token_secret_for_files'));
            if ((yield isAuthorizedByRoom()) || isAuthorizedByJWT()) {
                return true;
            }
            const uid = rc_uid || headers['x-user-id'];
            const authToken = rc_token || headers['x-auth-token'];
            const user = uid && authToken && (yield models_1.Users.findOneByIdAndLoginToken(uid, (0, account_utils_1.hashLoginToken)(authToken), { projection: { _id: 1 } }));
            if (!user) {
                return false;
            }
            if (!(file === null || file === void 0 ? void 0 : file.rid)) {
                return true;
            }
            const fileUploadRestrictedToMembers = server_1.settings.get('FileUpload_Restrict_to_room_members');
            const fileUploadRestrictToUsersWhoCanAccessRoom = server_1.settings.get('FileUpload_Restrict_to_users_who_can_access_room');
            if (!fileUploadRestrictToUsersWhoCanAccessRoom && !fileUploadRestrictedToMembers) {
                return true;
            }
            if (fileUploadRestrictedToMembers && !fileUploadRestrictToUsersWhoCanAccessRoom) {
                const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(file.rid, user._id, { projection: { _id: 1 } });
                return !!sub;
            }
            if (fileUploadRestrictToUsersWhoCanAccessRoom && !fileUploadRestrictedToMembers) {
                return (0, canAccessRoom_1.canAccessRoomIdAsync)(file.rid, user._id);
            }
            return false;
        });
    },
    addExtensionTo(file) {
        if (mimeTypes_1.mime.lookup(file.name || '') === file.type) {
            return file;
        }
        // This file type can be pretty much anything, so it's better if we don't mess with the file extension
        if (file.type !== 'application/octet-stream') {
            const ext = mimeTypes_1.mime.extension(file.type || '');
            if (ext && new RegExp(`\\.${ext}$`, 'i').test(file.name || '') === false) {
                file.name = `${file.name}.${ext}`;
            }
        }
        return file;
    },
    getStore(modelName) {
        const storageType = server_1.settings.get('FileUpload_Storage_Type');
        const handlerName = `${storageType}:${modelName}`;
        return this.getStoreByName(handlerName);
    },
    getStoreByName(handlerName) {
        if (!handlerName) {
            system_1.SystemLogger.error(`Empty Upload handler does not exists`);
            throw new Error(`Empty Upload handler does not exists`);
        }
        if (this.handlers[handlerName] == null) {
            system_1.SystemLogger.error(`Upload handler "${handlerName}" does not exists`);
        }
        return this.handlers[handlerName];
    },
    get(file, req, res, next) {
        const store = this.getStoreByName(file.store);
        if (store === null || store === void 0 ? void 0 : store.get) {
            return store.get(file, req, res, next);
        }
        res.writeHead(404);
        res.end();
    },
    getBuffer(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this.getStoreByName(file.store);
            if (!(store === null || store === void 0 ? void 0 : store.get)) {
                throw new Error('Store is invalid');
            }
            const buffer = new stream_buffers_1.default.WritableStreamBuffer({
                initialSize: file.size,
            });
            return new Promise((resolve, reject) => {
                var _a;
                buffer.on('finish', () => {
                    const contents = buffer.getContents();
                    if (contents === false) {
                        return reject();
                    }
                    resolve(contents);
                });
                void ((_a = store.copy) === null || _a === void 0 ? void 0 : _a.call(store, file, buffer));
            });
        });
    },
    copy(file, targetFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this.getStoreByName(file.store);
            const out = fs_1.default.createWriteStream(targetFile);
            file = exports.FileUpload.addExtensionTo(file);
            if (store.copy) {
                yield store.copy(file, out);
                return true;
            }
            return false;
        });
    },
    redirectToFile(fileUrl, _req, res) {
        res.removeHeader('Content-Length');
        res.removeHeader('Cache-Control');
        res.setHeader('Location', fileUrl);
        res.writeHead(302);
        res.end();
    },
    proxyFile(fileName, fileUrl, forceDownload, request, _req, res) {
        res.setHeader('Content-Disposition', `${forceDownload ? 'attachment' : 'inline'}; filename="${encodeURI(fileName)}"`);
        request.get(fileUrl, (fileRes) => {
            if (fileRes.statusCode !== 200) {
                res.setHeader('x-rc-proxyfile-status', String(fileRes.statusCode));
                res.setHeader('content-length', 0);
                res.writeHead(500);
                res.end();
                return;
            }
            // eslint-disable-next-line prettier/prettier
            const headersToProxy = ['age', 'cache-control', 'content-length', 'content-type', 'date', 'expired', 'last-modified'];
            headersToProxy.forEach((header) => {
                fileRes.headers[header] && res.setHeader(header, String(fileRes.headers[header]));
            });
            fileRes.pipe(res);
        });
    },
    generateJWTToFileUrls({ rid, userId, fileId }) {
        if (!server_1.settings.get('FileUpload_ProtectFiles') || !server_1.settings.get('FileUpload_Enable_json_web_token_for_files')) {
            return;
        }
        return (0, JWTHelper_1.generateJWT)({
            rid,
            userId,
            fileId,
        }, server_1.settings.get('FileUpload_json_web_token_secret_for_files'));
    },
    removeFilesByRoomId(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (typeof rid !== 'string' || rid.trim().length === 0) {
                return;
            }
            const cursor = models_1.Messages.find({
                rid,
                'file._id': {
                    $exists: true,
                },
            }, {
                projection: {
                    'file._id': 1,
                },
            });
            try {
                for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                    _c = cursor_1_1.value;
                    _d = false;
                    const document = _c;
                    if (document.file) {
                        yield exports.FileUpload.getStore('Uploads').deleteById(document.file._id);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
};
class FileUploadClass {
    constructor({ name, model, store, get, insert, getStore, copy }) {
        this.name = name;
        this.model = model || this.getModelFromName();
        this._store = store || ufs_1.UploadFS.getStore(name);
        this.get = get;
        this.copy = copy;
        if (insert) {
            this.insert = insert;
        }
        if (getStore) {
            this.getStore = getStore;
        }
        exports.FileUpload.handlers[name] = this;
    }
    getStore() {
        return this._store;
    }
    get store() {
        return this.getStore();
    }
    set store(store) {
        this._store = store;
    }
    getModelFromName() {
        const modelsAvailable = {
            Avatars: models_1.Avatars,
            Uploads: models_1.Uploads,
            UserDataFiles: models_1.UserDataFiles,
        };
        const modelName = this.name.split(':')[1];
        if (!modelsAvailable[modelName]) {
            throw new Error('Invalid Model for FileUpload');
        }
        return modelsAvailable[modelName];
    }
    delete(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // TODO: Remove this method
            if ((_a = this.store) === null || _a === void 0 ? void 0 : _a.delete) {
                yield this.store.delete(fileId);
            }
            return this.model.deleteFile(fileId);
        });
    }
    deleteById(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.model.findOneById(fileId);
            if (!file) {
                return;
            }
            const store = exports.FileUpload.getStoreByName(file.store);
            return store.delete(file._id);
        });
    }
    deleteByName(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.model.findOneByName(fileName);
            if (!file) {
                return;
            }
            const store = exports.FileUpload.getStoreByName(file.store);
            return store.delete(file._id);
        });
    }
    deleteByRoomId(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.model.findOneByRoomId(rid);
            if (!file) {
                return;
            }
            const store = exports.FileUpload.getStoreByName(file.store);
            return store.delete(file._id);
        });
    }
    _doInsert(fileData, streamOrBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = yield this.store.create(fileData);
            const tmpFile = ufs_1.UploadFS.getTempFilePath(fileId);
            try {
                if (streamOrBuffer instanceof stream_1.default) {
                    streamOrBuffer.pipe(fs_1.default.createWriteStream(tmpFile));
                }
                else if (streamOrBuffer instanceof buffer_1.Buffer) {
                    fs_1.default.writeFileSync(tmpFile, streamOrBuffer);
                }
                else {
                    throw new Error('Invalid file type');
                }
                const file = yield (0, ufs_methods_1.ufsComplete)(fileId, this.name);
                return file;
            }
            catch (e) {
                throw e;
            }
        });
    }
    insert(fileData, streamOrBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (streamOrBuffer instanceof stream_1.default) {
                streamOrBuffer = yield (0, streamToBuffer_1.streamToBuffer)(streamOrBuffer);
            }
            if (streamOrBuffer instanceof Uint8Array) {
                // Services compat :)
                streamOrBuffer = buffer_1.Buffer.from(streamOrBuffer);
            }
            // Check if the fileData matches store filter
            const filter = this.store.getFilter();
            if (filter === null || filter === void 0 ? void 0 : filter.check) {
                yield filter.check(fileData, streamOrBuffer);
            }
            return this._doInsert(fileData, streamOrBuffer);
        });
    }
}
exports.FileUploadClass = FileUploadClass;
