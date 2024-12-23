"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURL = void 0;
const server_1 = require("../../settings/server");
const getURL_1 = require("../lib/getURL");
const getURL = function (path, // eslint-disable-next-line @typescript-eslint/naming-convention
params = {}, cloudDeepLinkUrl) {
    const cdnPrefix = server_1.settings.get('CDN_PREFIX') || '';
    const siteUrl = server_1.settings.get('Site_Url') || '';
    return (0, getURL_1.getURLWithoutSettings)(path, params, cdnPrefix, siteUrl, cloudDeepLinkUrl);
};
exports.getURL = getURL;
