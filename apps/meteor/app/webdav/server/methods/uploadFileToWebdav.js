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
const logger_1 = require("@rocket.chat/logger");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const uploadFileToWebdav_1 = require("../lib/uploadFileToWebdav");
const logger = new logger_1.Logger('WebDAV_Upload');
meteor_1.Meteor.methods({
    uploadFileToWebdav(accountId, fileData, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!meteor_1.Meteor.userId()) {
                throw new core_services_1.MeteorError('error-invalid-user', 'Invalid User', {
                    method: 'uploadFileToWebdav',
                });
            }
            if (!server_1.settings.get('Webdav_Integration_Enabled')) {
                throw new core_services_1.MeteorError('error-not-allowed', 'WebDAV Integration Not Allowed', {
                    method: 'uploadFileToWebdav',
                });
            }
            try {
                yield (0, uploadFileToWebdav_1.uploadFileToWebdav)(accountId, fileData instanceof ArrayBuffer ? Buffer.from(fileData) : fileData, name);
                return { success: true };
            }
            catch (error) {
                if (typeof error === 'object' && error instanceof Error && error.name === 'error-invalid-account') {
                    throw new core_services_1.MeteorError(error.name, 'Invalid WebDAV Account', {
                        method: 'uploadFileToWebdav',
                    });
                }
                logger.error(error);
                if (error.response) {
                    const { status } = error.response;
                    if (status === 404) {
                        return { success: false, message: 'webdav-server-not-found' };
                    }
                    if (status === 401) {
                        return { success: false, message: 'error-invalid-account' };
                    }
                    if (status === 412) {
                        return { success: false, message: 'Duplicate_file_name_found' };
                    }
                }
                return { success: false, message: 'FileUpload_Error' };
            }
        });
    },
});
