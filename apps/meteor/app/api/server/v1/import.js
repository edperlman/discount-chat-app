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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../importer/server");
const methods_1 = require("../../../importer/server/methods");
const PendingAvatarImporter_1 = require("../../../importer-pending-avatars/server/PendingAvatarImporter");
const PendingFileImporter_1 = require("../../../importer-pending-files/server/PendingFileImporter");
const api_1 = require("../api");
api_1.API.v1.addRoute('uploadImportFile', {
    authRequired: true,
    validateParams: rest_typings_1.isUploadImportFileParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { binaryContent, contentType, fileName, importerKey } = this.bodyParams;
            return api_1.API.v1.success(yield (0, methods_1.executeUploadImportFile)(this.userId, binaryContent, contentType, fileName, importerKey));
        });
    },
});
api_1.API.v1.addRoute('downloadPublicImportFile', {
    authRequired: true,
    validateParams: rest_typings_1.isDownloadPublicImportFileParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { fileUrl, importerKey } = this.bodyParams;
            yield (0, methods_1.executeDownloadPublicImportFile)(this.userId, fileUrl, importerKey);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('startImport', {
    authRequired: true,
    validateParams: rest_typings_1.isStartImportParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { input } = this.bodyParams;
            yield (0, methods_1.executeStartImport)({ input }, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('getImportFileData', {
    authRequired: true,
    validateParams: rest_typings_1.isGetImportFileDataParamsGET,
    permissionsRequired: ['run-import'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, methods_1.executeGetImportFileData)();
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('getImportProgress', {
    authRequired: true,
    validateParams: rest_typings_1.isGetImportProgressParamsGET,
    permissionsRequired: ['run-import'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, methods_1.executeGetImportProgress)();
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('getLatestImportOperations', {
    authRequired: true,
    validateParams: rest_typings_1.isGetLatestImportOperationsParamsGET,
    permissionsRequired: ['view-import-operations'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, methods_1.executeGetLatestImportOperations)();
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('downloadPendingFiles', {
    authRequired: true,
    validateParams: rest_typings_1.isDownloadPendingFilesParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const importer = server_1.Importers.get('pending-files');
            if (!importer) {
                throw new meteor_1.Meteor.Error('error-importer-not-defined', 'The Pending File Importer was not found.', 'downloadPendingFiles');
            }
            const operation = yield core_services_1.Import.newOperation(this.userId, importer.name, importer.key);
            const instance = new PendingFileImporter_1.PendingFileImporter(importer, operation);
            const count = yield instance.prepareFileCount();
            return api_1.API.v1.success({
                count,
            });
        });
    },
});
api_1.API.v1.addRoute('downloadPendingAvatars', {
    authRequired: true,
    validateParams: rest_typings_1.isDownloadPendingAvatarsParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const importer = server_1.Importers.get('pending-avatars');
            if (!importer) {
                throw new meteor_1.Meteor.Error('error-importer-not-defined', 'The Pending File Importer was not found.', 'downloadPendingAvatars');
            }
            const operation = yield core_services_1.Import.newOperation(this.userId, importer.name, importer.key);
            const instance = new PendingAvatarImporter_1.PendingAvatarImporter(importer, operation);
            const count = yield instance.prepareFileCount();
            return api_1.API.v1.success({
                count,
            });
        });
    },
});
api_1.API.v1.addRoute('getCurrentImportOperation', {
    authRequired: true,
    validateParams: rest_typings_1.isGetCurrentImportOperationParamsGET,
    permissionsRequired: ['run-import'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield models_1.Imports.findLastImport();
            return api_1.API.v1.success({
                operation,
            });
        });
    },
});
api_1.API.v1.addRoute('importers.list', {
    authRequired: true,
    validateParams: rest_typings_1.isImportersListParamsGET,
    permissionsRequired: ['run-import'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const importers = server_1.Importers.getAllVisible().map(({ key, name }) => ({ key, name }));
            return api_1.API.v1.success(importers);
        });
    },
});
api_1.API.v1.addRoute('import.clear', {
    authRequired: true,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield core_services_1.Import.clear();
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('import.new', {
    authRequired: true,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield core_services_1.Import.newOperation(this.userId, 'api', 'api');
            return api_1.API.v1.success({ operation });
        });
    },
});
api_1.API.v1.addRoute('import.status', {
    authRequired: true,
    permissionsRequired: ['run-import'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield core_services_1.Import.status();
            return api_1.API.v1.success(status);
        });
    },
});
api_1.API.v1.addRoute('import.addUsers', {
    authRequired: true,
    validateParams: rest_typings_1.isImportAddUsersParamsPOST,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { users } = this.bodyParams;
            yield core_services_1.Import.addUsers(users);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('import.run', {
    authRequired: true,
    permissionsRequired: ['run-import'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield core_services_1.Import.run(this.userId);
            return api_1.API.v1.success();
        });
    },
});
