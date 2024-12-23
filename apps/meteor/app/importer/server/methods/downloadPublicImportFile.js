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
exports.executeDownloadPublicImportFile = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const core_services_1 = require("@rocket.chat/core-services");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const ImporterProgressStep_1 = require("../../lib/ImporterProgressStep");
const store_1 = require("../startup/store");
function downloadHttpFile(fileUrl, writeStream) {
    const protocol = fileUrl.startsWith('https') ? https_1.default : http_1.default;
    protocol.get(fileUrl, (response) => {
        response.pipe(writeStream);
    });
}
function copyLocalFile(filePath, writeStream) {
    const readStream = fs_1.default.createReadStream(filePath);
    readStream.pipe(writeStream);
}
const executeDownloadPublicImportFile = (userId, fileUrl, importerKey) => __awaiter(void 0, void 0, void 0, function* () {
    const importer = __1.Importers.get(importerKey);
    const isUrl = fileUrl.startsWith('http');
    if (!importer) {
        throw new meteor_1.Meteor.Error('error-importer-not-defined', `The importer (${importerKey}) has no import class defined.`, 'downloadImportFile');
    }
    // Check if it's a valid url or path before creating a new import record
    if (!isUrl && !fs_1.default.existsSync(fileUrl)) {
        throw new meteor_1.Meteor.Error('error-import-file-missing', fileUrl, 'downloadPublicImportFile');
    }
    const operation = yield core_services_1.Import.newOperation(userId, importer.name, importer.key);
    const instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
    const oldFileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1).split('?')[0];
    const date = new Date();
    const dateStr = `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}${date.getUTCHours()}${date.getUTCMinutes()}${date.getUTCSeconds()}`;
    const newFileName = `${dateStr}_${userId}_${oldFileName}`;
    // Store the file name on the imports collection
    yield instance.startFileUpload(newFileName);
    yield instance.updateProgress(ImporterProgressStep_1.ProgressStep.DOWNLOADING_FILE);
    const writeStream = store_1.RocketChatImportFileInstance.createWriteStream(newFileName);
    writeStream.on('error', () => {
        void instance.updateProgress(ImporterProgressStep_1.ProgressStep.ERROR);
    });
    writeStream.on('end', () => {
        void instance.updateProgress(ImporterProgressStep_1.ProgressStep.FILE_LOADED);
    });
    if (isUrl) {
        downloadHttpFile(fileUrl, writeStream);
    }
    else {
        // If the url is actually a folder path on the current machine, skip moving it to the file store
        if (fs_1.default.statSync(fileUrl).isDirectory()) {
            yield instance.updateRecord({ file: fileUrl });
            yield instance.updateProgress(ImporterProgressStep_1.ProgressStep.FILE_LOADED);
            return;
        }
        copyLocalFile(fileUrl, writeStream);
    }
});
exports.executeDownloadPublicImportFile = executeDownloadPublicImportFile;
meteor_1.Meteor.methods({
    downloadPublicImportFile(fileUrl, importerKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'downloadPublicImportFile');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'run-import'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Importing is not allowed', 'downloadPublicImportFile');
            }
            yield (0, exports.executeDownloadPublicImportFile)(userId, fileUrl, importerKey);
        });
    },
});
