"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURLWithoutSettings = exports._getURL = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const isURL_1 = require("../../../lib/utils/isURL");
const stringUtils_1 = require("../../../lib/utils/stringUtils");
function getCloudUrl(path, 
// eslint-disable-next-line @typescript-eslint/naming-convention
_site_url, cloudRoute, cloudParams = {}, deeplinkUrl = '') {
    const cloudBaseUrl = deeplinkUrl.replace(/\/+$/, '');
    const siteUrl = (0, stringUtils_1.rtrim)(_site_url, '/');
    // Remove the protocol
    const host = siteUrl.replace(/https?\:\/\//i, '');
    path = (0, stringUtils_1.ltrim)(path, '/');
    Object.assign(cloudParams, {
        host,
        path,
    });
    if (siteUrl.includes('http://')) {
        cloudParams.secure = 'no';
    }
    const params = Object.entries(cloudParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    return `${cloudBaseUrl}/${cloudRoute}?${params}`;
}
const _getURL = (path, 
// eslint-disable-next-line @typescript-eslint/naming-convention
{ cdn, full, cloud, cloud_route, cloud_params, _cdn_prefix, _root_url_path_prefix, _site_url }, deeplinkUrl) => {
    if ((0, isURL_1.isURL)(path)) {
        return path;
    }
    const [_path, _query] = path.split('?');
    path = _path;
    const query = _query ? `?${_query}` : '';
    const siteUrl = (0, stringUtils_1.rtrim)((0, stringUtils_1.trim)(_site_url || ''), '/');
    const cloudRoute = (0, stringUtils_1.trim)(cloud_route || '');
    const cdnPrefix = (0, stringUtils_1.rtrim)((0, stringUtils_1.trim)(_cdn_prefix || ''), '/');
    const pathPrefix = (0, stringUtils_1.rtrim)((0, stringUtils_1.trim)(_root_url_path_prefix || ''), '/');
    const finalPath = (0, stringUtils_1.ltrim)((0, stringUtils_1.trim)(path), '/');
    const url = (0, stringUtils_1.rtrim)(`${pathPrefix}/${finalPath}`, '/') + query;
    if (cloud) {
        const cloudParams = cloud_params || {};
        return getCloudUrl(url, siteUrl, cloudRoute, cloudParams, deeplinkUrl);
    }
    if (cdn && cdnPrefix !== '') {
        return cdnPrefix + url;
    }
    if (full) {
        return siteUrl.replace(new RegExp(`${(0, string_helpers_1.escapeRegExp)(pathPrefix)}$`), '') + url;
    }
    return url;
};
exports._getURL = _getURL;
const getURLWithoutSettings = (path, 
// eslint-disable-next-line @typescript-eslint/naming-convention
{ cdn = true, full = false, cloud = false, cloud_route = '', cloud_params = {}, }, cdnPrefix, siteUrl, cloudDeepLinkUrl) => (0, exports._getURL)(path, {
    cdn,
    full,
    cloud,
    cloud_route,
    cloud_params,
    _cdn_prefix: cdnPrefix,
    _root_url_path_prefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX,
    _site_url: siteUrl,
}, cloudDeepLinkUrl);
exports.getURLWithoutSettings = getURLWithoutSettings;
