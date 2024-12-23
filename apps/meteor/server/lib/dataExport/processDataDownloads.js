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
exports.processDataDownloads = processDataDownloads;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const server_1 = require("../../../app/file-upload/server");
const server_2 = require("../../../app/settings/server");
const getURL_1 = require("../../../app/utils/server/getURL");
const fileUtils_1 = require("../fileUtils");
const i18n_1 = require("../i18n");
const copyFileUpload_1 = require("./copyFileUpload");
const exportRoomMessagesToFile_1 = require("./exportRoomMessagesToFile");
const getPath_1 = require("./getPath");
const getRoomData_1 = require("./getRoomData");
const makeZipFile_1 = require("./makeZipFile");
const sendEmail_1 = require("./sendEmail");
const uploadZipFile_1 = require("./uploadZipFile");
const loadUserSubscriptions = (_exportOperation, fileType, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const roomList = [];
    const cursor = models_1.Subscriptions.findByUserId(userId);
    try {
        for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
            _c = cursor_1_1.value;
            _d = false;
            const subscription = _c;
            const roomData = yield (0, getRoomData_1.getRoomData)(subscription.rid, userId);
            roomData.targetFile = `${(fileType === 'json' && roomData.roomName) || subscription.rid}.${fileType}`;
            roomList.push(roomData);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return roomList;
});
const generateUserFile = (exportOperation, userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData) {
        return;
    }
    yield (0, promises_1.mkdir)(exportOperation.exportPath, { recursive: true });
    const { username, name, statusText, emails, roles, services } = userData;
    const dataToSave = {
        username,
        name,
        statusText,
        emails: emails === null || emails === void 0 ? void 0 : emails.map(({ address }) => address),
        roles,
        services: services ? Object.keys(services) : undefined,
    };
    const fileName = (0, fileUtils_1.joinPath)(exportOperation.exportPath, exportOperation.fullExport ? 'user.json' : 'user.html');
    if (exportOperation.fullExport) {
        yield (0, promises_1.writeFile)(fileName, JSON.stringify(dataToSave), { encoding: 'utf8' });
        exportOperation.generatedUserFile = true;
        return;
    }
    return new Promise((resolve, reject) => {
        const stream = (0, fs_1.createWriteStream)(fileName, { encoding: 'utf8' });
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.write('<!DOCTYPE html>\n');
        stream.write('<meta http-equiv="content-type" content="text/html; charset=utf-8">\n');
        for (const [key, value] of Object.entries(dataToSave)) {
            stream.write(`<p><strong>${key}</strong>:`);
            if (typeof value === 'string') {
                stream.write(value);
            }
            else if (Array.isArray(value)) {
                stream.write('<br/>');
                for (const item of value) {
                    stream.write(`${item}<br/>`);
                }
            }
            stream.write('</p>\n');
        }
        stream.end();
    });
});
const generateUserAvatarFile = (exportOperation, userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(userData === null || userData === void 0 ? void 0 : userData.username)) {
        return;
    }
    yield (0, promises_1.mkdir)(exportOperation.exportPath, { recursive: true });
    const file = yield models_1.Avatars.findOneByName(userData.username);
    if (!file) {
        return;
    }
    const filePath = (0, fileUtils_1.joinPath)(exportOperation.exportPath, 'avatar');
    if (yield ((_a = server_1.FileUpload.copy) === null || _a === void 0 ? void 0 : _a.call(server_1.FileUpload, file, filePath))) {
        exportOperation.generatedAvatar = true;
    }
});
const generateChannelsFile = (type, exportPath, exportOperation) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (type !== 'json') {
        return;
    }
    yield (0, promises_1.mkdir)(exportOperation.exportPath, { recursive: true });
    const fileName = (0, fileUtils_1.joinPath)(exportPath, 'channels.json');
    yield (0, promises_1.writeFile)(fileName, (_c = (_b = (_a = exportOperation.roomList) === null || _a === void 0 ? void 0 : _a.map((roomData) => JSON.stringify({
        roomId: roomData.roomId,
        roomName: roomData.roomName,
        type: roomData.type,
    }))) === null || _b === void 0 ? void 0 : _b.join('\n')) !== null && _c !== void 0 ? _c : '');
});
const isExportComplete = (exportOperation) => {
    var _a, _b;
    const incomplete = (_b = (_a = exportOperation.roomList) === null || _a === void 0 ? void 0 : _a.some((exportOpRoomData) => exportOpRoomData.status !== 'completed')) !== null && _b !== void 0 ? _b : false;
    return !incomplete;
};
const continueExportOperation = function (exportOperation) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        var _d;
        if (exportOperation.status === 'completed') {
            return;
        }
        const exportType = exportOperation.fullExport ? 'json' : 'html';
        if (!exportOperation.roomList) {
            exportOperation.roomList = yield loadUserSubscriptions(exportOperation, exportType, exportOperation.userId);
            if (exportOperation.fullExport) {
                exportOperation.status = 'exporting-rooms';
            }
            else {
                exportOperation.status = 'exporting';
            }
        }
        try {
            if (!exportOperation.generatedUserFile) {
                yield generateUserFile(exportOperation, exportOperation.userData);
            }
            if (!exportOperation.generatedAvatar) {
                yield generateUserAvatarFile(exportOperation, exportOperation.userData);
            }
            if (exportOperation.status === 'exporting-rooms') {
                yield generateChannelsFile(exportType, exportOperation.exportPath, exportOperation);
                exportOperation.status = 'exporting';
            }
            // Run every room on every request, to avoid missing new messages on the rooms that finished first.
            if (exportOperation.status === 'exporting') {
                const { fileList } = yield (0, exportRoomMessagesToFile_1.exportRoomMessagesToFile)(exportOperation.exportPath, exportOperation.assetsPath, exportType, exportOperation.roomList, exportOperation.userData, {}, exportOperation.userNameTable);
                if (!exportOperation.fileList) {
                    exportOperation.fileList = [];
                }
                exportOperation.fileList.push(...fileList);
                if (isExportComplete(exportOperation)) {
                    exportOperation.status = 'downloading';
                }
            }
            const generatedFileName = (0, uuid_1.v4)();
            const zipFolder = ((_d = server_2.settings.get('UserData_FileSystemZipPath')) === null || _d === void 0 ? void 0 : _d.trim()) || '/tmp/zipFiles';
            if (exportOperation.status === 'downloading') {
                try {
                    for (var _e = true, _f = __asyncValues(exportOperation.fileList), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                        _c = _g.value;
                        _e = false;
                        const attachmentData = _c;
                        yield (0, copyFileUpload_1.copyFileUpload)(attachmentData, exportOperation.assetsPath);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                const targetFile = (0, fileUtils_1.joinPath)(zipFolder, `${generatedFileName}.zip`);
                yield (0, promises_1.rm)(targetFile, { force: true });
                exportOperation.status = 'compressing';
            }
            if (exportOperation.status === 'compressing') {
                yield (0, promises_1.mkdir)(zipFolder, { recursive: true });
                exportOperation.generatedFile = (0, fileUtils_1.joinPath)(zipFolder, `${generatedFileName}.zip`);
                try {
                    yield (0, promises_1.access)(exportOperation.generatedFile);
                }
                catch (error) {
                    yield (0, makeZipFile_1.makeZipFile)(exportOperation.exportPath, exportOperation.generatedFile);
                }
                exportOperation.status = 'uploading';
            }
            if (exportOperation.status === 'uploading') {
                if (!exportOperation.generatedFile) {
                    throw new Error('No generated file');
                }
                const { _id: fileId } = yield (0, uploadZipFile_1.uploadZipFile)(exportOperation.generatedFile, exportOperation.userId, exportType);
                exportOperation.fileId = fileId;
                exportOperation.status = 'completed';
                yield models_1.ExportOperations.updateOperation(exportOperation);
            }
            yield models_1.ExportOperations.updateOperation(exportOperation);
        }
        catch (e) {
            console.error(e);
        }
    });
};
function processDataDownloads() {
    return __awaiter(this, void 0, void 0, function* () {
        const operation = yield models_1.ExportOperations.findOnePending();
        if (!operation) {
            return;
        }
        if (operation.status === 'completed') {
            return;
        }
        if (operation.status !== 'pending') {
            // If the operation has started but was not updated in over a day, then skip it
            if (operation._updatedAt && (0, moment_1.default)().diff((0, moment_1.default)(operation._updatedAt), 'days') > 1) {
                operation.status = 'skipped';
                yield models_1.ExportOperations.updateOperation(operation);
                return processDataDownloads();
            }
        }
        yield continueExportOperation(operation);
        yield models_1.ExportOperations.updateOperation(operation);
        if (operation.status === 'completed') {
            const file = operation.fileId
                ? yield models_1.UserDataFiles.findOneById(operation.fileId)
                : yield models_1.UserDataFiles.findLastFileByUser(operation.userId);
            if (!file) {
                return;
            }
            const subject = i18n_1.i18n.t('UserDataDownload_EmailSubject');
            const body = i18n_1.i18n.t('UserDataDownload_EmailBody', {
                download_link: (0, getURL_1.getURL)((0, getPath_1.getPath)(file._id), { cdn: false, full: true }),
            });
            yield (0, sendEmail_1.sendEmail)(operation.userData, subject, body);
        }
    });
}
