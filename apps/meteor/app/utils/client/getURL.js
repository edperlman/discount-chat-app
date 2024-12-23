"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURL = void 0;
const client_1 = require("../../settings/client");
const getURL_1 = require("../lib/getURL");
const rocketchat_info_1 = require("../rocketchat.info");
const getURL = function (path, // eslint-disable-next-line @typescript-eslint/naming-convention
params = {}, cloudDeepLinkUrl, cacheKey) {
    const cdnPrefix = client_1.settings.get('CDN_PREFIX') || '';
    const siteUrl = client_1.settings.get('Site_Url') || '';
    if (cacheKey) {
        path += `${path.includes('?') ? '&' : '?'}cacheKey=${rocketchat_info_1.Info.version}`;
    }
    return (0, getURL_1.getURLWithoutSettings)(path, params, cdnPrefix, siteUrl, cloudDeepLinkUrl);
};
exports.getURL = getURL;
