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
exports.notifyAppInstall = notifyAppInstall;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../../app/cloud/server");
const server_2 = require("../../../../app/settings/server");
const rocketchat_info_1 = require("../../../../app/utils/rocketchat.info");
function notifyAppInstall(marketplaceBaseUrl, action, appInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        try {
            const token = yield (0, server_1.getWorkspaceAccessToken)();
            headers.Authorization = `Bearer ${token}`;
            // eslint-disable-next-line no-empty
        }
        catch (_a) { }
        let siteUrl = '';
        try {
            siteUrl = server_2.settings.get('Site_Url');
            // eslint-disable-next-line no-empty
        }
        catch (_b) { }
        const data = {
            action,
            appName: appInfo.name,
            appSlug: appInfo.nameSlug,
            appVersion: appInfo.version,
            rocketChatVersion: rocketchat_info_1.Info.version,
            engineVersion: rocketchat_info_1.Info.marketplaceApiVersion,
            siteUrl,
        };
        const pendingSentUrl = `${marketplaceBaseUrl}/v1/apps/${appInfo.id}/install`;
        try {
            yield (0, server_fetch_1.serverFetch)(pendingSentUrl, {
                method: 'POST',
                headers,
                body: data,
            });
            // eslint-disable-next-line no-empty
        }
        catch (_c) { }
    });
}
