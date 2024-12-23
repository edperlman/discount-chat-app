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
exports.executeGetImportFileData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const ImporterProgressStep_1 = require("../../lib/ImporterProgressStep");
const store_1 = require("../startup/store");
const executeGetImportFileData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const operation = yield models_1.Imports.findLastImport();
    if (!operation) {
        throw new meteor_1.Meteor.Error('error-operation-not-found', 'Import Operation Not Found', 'getImportFileData');
    }
    const { importerKey } = operation;
    const importer = __1.Importers.get(importerKey);
    if (!importer) {
        throw new meteor_1.Meteor.Error('error-importer-not-defined', `The importer (${importerKey}) has no import class defined.`, 'getImportFileData');
    }
    const instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
    const waitingSteps = [
        ImporterProgressStep_1.ProgressStep.DOWNLOADING_FILE,
        ImporterProgressStep_1.ProgressStep.PREPARING_CHANNELS,
        ImporterProgressStep_1.ProgressStep.PREPARING_MESSAGES,
        ImporterProgressStep_1.ProgressStep.PREPARING_USERS,
        ImporterProgressStep_1.ProgressStep.PREPARING_CONTACTS,
        ImporterProgressStep_1.ProgressStep.PREPARING_STARTED,
    ];
    if (waitingSteps.indexOf(instance.progress.step) >= 0) {
        if ((_a = instance.importRecord) === null || _a === void 0 ? void 0 : _a.valid) {
            return { waiting: true };
        }
        throw new meteor_1.Meteor.Error('error-import-operation-invalid', 'Invalid Import Operation', 'getImportFileData');
    }
    const readySteps = [
        ImporterProgressStep_1.ProgressStep.USER_SELECTION,
        ImporterProgressStep_1.ProgressStep.DONE,
        ImporterProgressStep_1.ProgressStep.CANCELLED,
        ImporterProgressStep_1.ProgressStep.ERROR,
    ];
    if (readySteps.indexOf(instance.progress.step) >= 0) {
        return instance.buildSelection();
    }
    const fileName = instance.importRecord.file;
    if (fileName) {
        const fullFilePath = fs_1.default.existsSync(fileName) ? fileName : path_1.default.join(store_1.RocketChatImportFileInstance.absolutePath, fileName);
        yield instance.prepareUsingLocalFile(fullFilePath);
    }
    return instance.buildSelection();
});
exports.executeGetImportFileData = executeGetImportFileData;
meteor_1.Meteor.methods({
    getImportFileData() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'getImportFileData');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'run-import'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Importing is not allowed', 'getImportFileData');
            }
            return (0, exports.executeGetImportFileData)();
        });
    },
});
