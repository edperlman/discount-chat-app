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
exports.executeGetImportProgress = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const executeGetImportProgress = () => __awaiter(void 0, void 0, void 0, function* () {
    const operation = yield models_1.Imports.findLastImport();
    if (!operation) {
        throw new meteor_1.Meteor.Error('error-operation-not-found', 'Import Operation Not Found', 'getImportProgress');
    }
    const { importerKey } = operation;
    const importer = __1.Importers.get(importerKey);
    if (!importer) {
        throw new meteor_1.Meteor.Error('error-importer-not-defined', `The importer (${importerKey}) has no import class defined.`, 'getImportProgress');
    }
    const instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
    return instance.getProgress();
});
exports.executeGetImportProgress = executeGetImportProgress;
meteor_1.Meteor.methods({
    getImportProgress() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'getImportProgress');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'run-import'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Importing is not allowed', 'setupImporter');
            }
            return (0, exports.executeGetImportProgress)();
        });
    },
});
