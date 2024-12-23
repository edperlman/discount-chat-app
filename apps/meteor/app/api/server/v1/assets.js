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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const server_1 = require("../../../assets/server");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_2 = require("../../../settings/server");
const api_1 = require("../api");
const getUploadFormData_1 = require("../lib/getUploadFormData");
api_1.API.v1.addRoute('assets.setAsset', {
    authRequired: true,
    permissionsRequired: ['manage-assets'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const asset = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'asset', sizeLimit: server_2.settings.get('FileUpload_MaxFileSize') });
            const { fileBuffer, fields, filename, mimetype } = asset;
            const { refreshAllClients, assetName: customName } = fields;
            const assetName = customName || filename;
            const assetsKeys = Object.keys(server_1.RocketChatAssets.assets);
            const isValidAsset = assetsKeys.includes(assetName);
            if (!isValidAsset) {
                throw new Error('Invalid asset');
            }
            const { key, value } = yield server_1.RocketChatAssets.setAssetWithBuffer(fileBuffer, mimetype, assetName);
            const { modifiedCount } = yield (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            })(models_1.Settings.updateValueById, key, value);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)(key);
            }
            if (refreshAllClients) {
                yield (0, server_1.refreshClients)(this.userId);
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('assets.unsetAsset', {
    authRequired: true,
    validateParams: rest_typings_1.isAssetsUnsetAssetProps,
    permissionsRequired: ['manage-assets'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { assetName, refreshAllClients } = this.bodyParams;
            const isValidAsset = Object.keys(server_1.RocketChatAssets.assets).includes(assetName);
            if (!isValidAsset) {
                throw Error('Invalid asset');
            }
            const { key, value } = yield server_1.RocketChatAssets.unsetAsset(assetName);
            const { modifiedCount } = yield (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            })(models_1.Settings.updateValueById, key, value);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)(key);
            }
            if (refreshAllClients) {
                yield (0, server_1.refreshClients)(this.userId);
            }
            return api_1.API.v1.success();
        });
    },
});
