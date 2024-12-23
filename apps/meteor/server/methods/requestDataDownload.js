"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = __importStar(require("path"));
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../app/settings/server");
const dataExport = __importStar(require("../lib/dataExport"));
meteor_1.Meteor.methods({
    requestDataDownload(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fullExport = false }) {
            var _b;
            const currentUserData = yield meteor_1.Meteor.userAsync();
            if (!currentUserData) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
            }
            const userId = currentUserData._id;
            const lastOperation = yield models_1.ExportOperations.findLastOperationByUser(userId, fullExport);
            const requestDay = lastOperation ? lastOperation.createdAt : new Date();
            const pendingOperationsBeforeMyRequestCount = yield models_1.ExportOperations.countAllPendingBeforeMyRequest(requestDay);
            if (lastOperation) {
                const yesterday = new Date();
                yesterday.setUTCDate(yesterday.getUTCDate() - 1);
                if (lastOperation.createdAt > yesterday) {
                    if (lastOperation.status === 'completed') {
                        const file = lastOperation.fileId
                            ? yield models_1.UserDataFiles.findOneById(lastOperation.fileId)
                            : yield models_1.UserDataFiles.findLastFileByUser(userId);
                        if (file) {
                            return {
                                requested: false,
                                exportOperation: lastOperation,
                                url: dataExport.getPath(file._id),
                                pendingOperationsBeforeMyRequest: pendingOperationsBeforeMyRequestCount,
                            };
                        }
                    }
                    return {
                        requested: false,
                        exportOperation: lastOperation,
                        url: null,
                        pendingOperationsBeforeMyRequest: pendingOperationsBeforeMyRequestCount,
                    };
                }
            }
            const tempFolder = ((_b = server_1.settings.get('UserData_FileSystemPath')) === null || _b === void 0 ? void 0 : _b.trim()) || (yield (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'userData')));
            const exportOperation = {
                status: 'preparing',
                userId: currentUserData._id,
                roomList: undefined,
                fileList: [],
                generatedFile: undefined,
                fullExport,
                userData: currentUserData,
            }; // @todo yikes!
            const id = yield models_1.ExportOperations.create(exportOperation);
            exportOperation._id = id;
            const folderName = path_1.default.join(tempFolder, id);
            const assetsFolder = path_1.default.join(folderName, 'assets');
            exportOperation.exportPath = folderName;
            exportOperation.assetsPath = assetsFolder;
            exportOperation.status = 'pending';
            yield models_1.ExportOperations.updateOperation(exportOperation);
            return {
                requested: true,
                exportOperation,
                url: null,
                pendingOperationsBeforeMyRequest: pendingOperationsBeforeMyRequestCount,
            };
        });
    },
});
