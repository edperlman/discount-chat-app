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
exports.getServerInfo = getServerInfo;
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const supportedVersionsToken_1 = require("../../../cloud/server/functions/supportedVersionsToken/supportedVersionsToken");
const server_1 = require("../../../settings/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const removePatchInfo = (version) => version.replace(/(\d+\.\d+).*/, '$1');
function getServerInfo(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasPermissionToViewStatistics = userId && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-statistics'));
        const supportedVersionsToken = yield (0, supportedVersionsToken_1.wrapPromise)((0, supportedVersionsToken_1.getCachedSupportedVersionsToken)());
        const cloudWorkspaceId = server_1.settings.get('Cloud_Workspace_Id');
        return Object.assign(Object.assign(Object.assign(Object.assign({ version: removePatchInfo(rocketchat_info_1.Info.version) }, (hasPermissionToViewStatistics && {
            info: Object.assign({}, rocketchat_info_1.Info),
            version: rocketchat_info_1.Info.version,
        })), { minimumClientVersions: rocketchat_info_1.minimumClientVersions }), (supportedVersionsToken.success &&
            supportedVersionsToken.result && {
            supportedVersions: { signed: supportedVersionsToken.result },
        })), { cloudWorkspaceId });
    });
}
