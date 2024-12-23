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
exports.executeUploadImportFile = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../file/server");
const ImporterProgressStep_1 = require("../../lib/ImporterProgressStep");
const store_1 = require("../startup/store");
const executeUploadImportFile = (userId, binaryContent, contentType, fileName, importerKey) => __awaiter(void 0, void 0, void 0, function* () {
    const importer = __1.Importers.get(importerKey);
    if (!importer) {
        throw new meteor_1.Meteor.Error('error-importer-not-defined', `The importer (${importerKey}) has no import class defined.`, 'uploadImportFile');
    }
    const operation = yield core_services_1.Import.newOperation(userId, importer.name, importer.key);
    const instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
    const date = new Date();
    const dateStr = `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}${date.getUTCHours()}${date.getUTCMinutes()}${date.getUTCSeconds()}`;
    const newFileName = `${dateStr}_${userId}_${fileName}`;
    // Store the file name and content type on the imports collection
    yield instance.startFileUpload(newFileName, contentType);
    // Save the file on the File Store
    const file = Buffer.from(binaryContent, 'base64');
    const readStream = server_1.RocketChatFile.bufferToStream(file);
    const writeStream = store_1.RocketChatImportFileInstance.createWriteStream(newFileName, contentType);
    yield new Promise((resolve, reject) => {
        try {
            writeStream.on('end', () => {
                resolve();
            });
            writeStream.on('error', (e) => {
                reject(e);
            });
            readStream.pipe(writeStream);
        }
        catch (error) {
            reject(error);
        }
    });
    yield instance.updateProgress(ImporterProgressStep_1.ProgressStep.FILE_LOADED);
});
exports.executeUploadImportFile = executeUploadImportFile;
meteor_1.Meteor.methods({
    uploadImportFile(binaryContent, contentType, fileName, importerKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'uploadImportFile');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'run-import'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Importing is not allowed', 'uploadImportFile');
            }
            yield (0, exports.executeUploadImportFile)(userId, binaryContent, contentType, fileName, importerKey);
        });
    },
});
