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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OEmbed = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const change_case_1 = require("change-case");
const he_1 = __importDefault(require("he"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const ip_range_check_1 = __importDefault(require("ip-range-check"));
const jschardet_1 = __importDefault(require("jschardet"));
const callbacks_1 = require("../../../lib/callbacks");
const isURL_1 = require("../../../lib/utils/isURL");
const server_1 = require("../../settings/server");
const rocketchat_info_1 = require("../../utils/rocketchat.info");
const MAX_EXTERNAL_URL_PREVIEWS = 5;
const log = new logger_1.Logger('OEmbed');
//  Detect encoding
//  Priority:
//  Detected == HTTP Header > Detected == HTML meta > HTTP Header > HTML meta > Detected > Default (utf-8)
//  See also: https://www.w3.org/International/questions/qa-html-encoding-declarations.en#quickanswer
const getCharset = function (contentType, body) {
    let detectedCharset;
    let httpHeaderCharset;
    let htmlMetaCharset;
    let result;
    contentType = contentType || '';
    const binary = body.toString('binary');
    const detected = jschardet_1.default.detect(binary);
    if (detected.confidence > 0.8) {
        detectedCharset = detected.encoding.toLowerCase();
    }
    const m1 = contentType.match(/charset=([\w\-]+)/i);
    if (m1) {
        httpHeaderCharset = m1[1].toLowerCase();
    }
    const m2 = binary.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);
    if (m2) {
        htmlMetaCharset = m2[1].toLowerCase();
    }
    if (detectedCharset) {
        if (detectedCharset === httpHeaderCharset) {
            result = httpHeaderCharset;
        }
        else if (detectedCharset === htmlMetaCharset) {
            result = htmlMetaCharset;
        }
    }
    if (!result) {
        result = httpHeaderCharset || htmlMetaCharset || detectedCharset;
    }
    return result || 'utf-8';
};
const toUtf8 = function (contentType, body) {
    return iconv_lite_1.default.decode(body, getCharset(contentType, body));
};
const getUrlContent = (urlObj_1, ...args_1) => __awaiter(void 0, [urlObj_1, ...args_1], void 0, function* (urlObj, redirectCount = 5) {
    var _a, e_1, _b, _c;
    const portsProtocol = new Map(Object.entries({
        80: 'http:',
        8080: 'http:',
        443: 'https:',
    }));
    const ignoredHosts = server_1.settings.get('API_EmbedIgnoredHosts').replace(/\s/g, '').split(',') || [];
    if (urlObj.hostname && (ignoredHosts.includes(urlObj.hostname) || (0, ip_range_check_1.default)(urlObj.hostname, ignoredHosts))) {
        throw new Error('invalid host');
    }
    const safePorts = server_1.settings.get('API_EmbedSafePorts').replace(/\s/g, '').split(',') || [];
    // checks if the URL port is in the safe ports list
    if (safePorts.length > 0 && urlObj.port && !safePorts.includes(urlObj.port)) {
        throw new Error('invalid/unsafe port');
    }
    // if port is not detected, use protocol to verify instead
    if (safePorts.length > 0 && !urlObj.port && !safePorts.some((port) => portsProtocol.get(port) === urlObj.protocol)) {
        throw new Error('invalid/unsafe port');
    }
    const data = yield callbacks_1.callbacks.run('oembed:beforeGetUrlContent', {
        urlObj,
    });
    const url = data.urlObj.toString();
    const sizeLimit = 250000;
    log.debug(`Fetching ${url} following redirects ${redirectCount} times`);
    const response = yield (0, server_fetch_1.serverFetch)(url, {
        compress: true,
        follow: redirectCount,
        headers: {
            'User-Agent': `${server_1.settings.get('API_Embed_UserAgent')} Rocket.Chat/${rocketchat_info_1.Info.version}`,
            'Accept-Language': server_1.settings.get('Language') || 'en',
        },
        size: sizeLimit, // max size of the response body, this was not working as expected so I'm also manually verifying that on the iterator
    }, server_1.settings.get('Allow_Invalid_SelfSigned_Certs'));
    let totalSize = 0;
    const chunks = [];
    try {
        for (var _d = true, _e = __asyncValues(response.body), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const chunk = _c;
            totalSize += chunk.length;
            chunks.push(chunk);
            if (totalSize > sizeLimit) {
                log.warn({ msg: 'OEmbed request size exceeded', url });
                break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    log.debug('Obtained response from server with length of', totalSize);
    const buffer = Buffer.concat(chunks);
    return {
        headers: Object.fromEntries(response.headers),
        body: toUtf8(response.headers.get('content-type') || 'text/plain', buffer),
        statusCode: response.status,
    };
});
const parseUrl = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const parsedUrlObject = { url, meta: {} };
        let foundMeta = false;
        if (!(0, isURL_1.isURL)(url)) {
            return { urlPreview: parsedUrlObject, foundMeta };
        }
        const data = yield getUrlMetaWithCache(url);
        if (!data) {
            return { urlPreview: parsedUrlObject, foundMeta };
        }
        if ((0, core_typings_1.isOEmbedUrlWithMetadata)(data) && data.meta) {
            parsedUrlObject.meta = getRelevantMetaTags(data.meta) || {};
            if ((_a = parsedUrlObject.meta) === null || _a === void 0 ? void 0 : _a.oembedHtml) {
                parsedUrlObject.meta.oembedHtml = insertMaxWidthInOembedHtml(parsedUrlObject.meta.oembedHtml) || '';
            }
        }
        foundMeta = true;
        return {
            urlPreview: Object.assign(Object.assign({}, parsedUrlObject), ((parsedUrlObject.headers || data.headers) && {
                headers: Object.assign(Object.assign(Object.assign({}, parsedUrlObject.headers), (((_b = data.headers) === null || _b === void 0 ? void 0 : _b.contentLength) && { contentLength: data.headers.contentLength })), (((_c = data.headers) === null || _c === void 0 ? void 0 : _c.contentType) && { contentType: data.headers.contentType })),
            })),
            foundMeta,
        };
    });
};
const getUrlMeta = function (url, withFragment) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug('Obtaining metadata for URL', url);
        const urlObj = new URL(url);
        if (withFragment) {
            urlObj.searchParams.set('_escaped_fragment_', '');
        }
        log.debug('Fetching url content', urlObj.toString());
        let content;
        try {
            content = yield getUrlContent(urlObj, 5);
        }
        catch (err) {
            log.error({ msg: 'Error fetching url content', err });
        }
        if (!content) {
            return;
        }
        log.debug('Parsing metadata for URL', url);
        const metas = {};
        if (content === null || content === void 0 ? void 0 : content.body) {
            const escapeMeta = (name, value) => {
                metas[name] = metas[name] || he_1.default.unescape(value);
                return metas[name];
            };
            content.body.replace(/<title[^>]*>([^<]*)<\/title>/gim, (_meta, title) => {
                return escapeMeta('pageTitle', title);
            });
            content.body.replace(/<meta[^>]*(?:name|property)=[']([^']*)['][^>]*\scontent=[']([^']*)['][^>]*>/gim, (_meta, name, value) => {
                return escapeMeta((0, change_case_1.camelCase)(name), value);
            });
            content.body.replace(/<meta[^>]*(?:name|property)=["]([^"]*)["][^>]*\scontent=["]([^"]*)["][^>]*>/gim, (_meta, name, value) => {
                return escapeMeta((0, change_case_1.camelCase)(name), value);
            });
            content.body.replace(/<meta[^>]*\scontent=[']([^']*)['][^>]*(?:name|property)=[']([^']*)['][^>]*>/gim, (_meta, value, name) => {
                return escapeMeta((0, change_case_1.camelCase)(name), value);
            });
            content.body.replace(/<meta[^>]*\scontent=["]([^"]*)["][^>]*(?:name|property)=["]([^"]*)["][^>]*>/gim, (_meta, value, name) => {
                return escapeMeta((0, change_case_1.camelCase)(name), value);
            });
            if (metas.fragment === '!' && withFragment == null) {
                return getUrlMeta(url, true);
            }
            delete metas.oembedHtml;
        }
        const headers = {};
        if (content === null || content === void 0 ? void 0 : content.headers) {
            const headerObj = content.headers;
            Object.keys(headerObj).forEach((header) => {
                headers[(0, change_case_1.camelCase)(header)] = headerObj[header];
            });
        }
        if (content && content.statusCode !== 200) {
            return;
        }
        return callbacks_1.callbacks.run('oembed:afterParseContent', {
            url,
            meta: metas,
            headers,
            content,
        });
    });
};
const getUrlMetaWithCache = function (url, withFragment) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug('Getting oembed metadata for', url);
        const cache = yield models_1.OEmbedCache.findOneById(url);
        if (cache) {
            log.debug('Found oembed metadata in cache for', url);
            return cache.data;
        }
        const data = yield getUrlMeta(url, withFragment);
        if (!data) {
            return;
        }
        try {
            log.debug('Saving oembed metadata in cache for', url);
            yield models_1.OEmbedCache.createWithIdAndData(url, data);
        }
        catch (_error) {
            log.error({ msg: 'OEmbed duplicated record', url });
        }
        return data;
    });
};
const getRelevantMetaTags = function (metaObj) {
    const tags = {};
    Object.keys(metaObj).forEach((key) => {
        const value = metaObj[key];
        if (/^(og|fb|twitter|oembed|msapplication).+|description|title|pageTitle$/.test(key.toLowerCase()) && value && value.trim() !== '') {
            tags[key] = value;
        }
    });
    if (Object.keys(tags).length > 0) {
        return tags;
    }
};
const insertMaxWidthInOembedHtml = (oembedHtml) => oembedHtml === null || oembedHtml === void 0 ? void 0 : oembedHtml.replace('iframe', 'iframe style="max-width: 100%;width:400px;height:225px"');
const rocketUrlParser = function (message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        log.debug('Parsing message URLs');
        if (!Array.isArray(message.urls)) {
            return message;
        }
        log.debug('URLs found', message.urls.length);
        if ((message.attachments && message.attachments.length > 0) ||
            message.urls.filter((item) => !item.url.includes(server_1.settings.get('Site_Url'))).length > MAX_EXTERNAL_URL_PREVIEWS) {
            log.debug('All URL ignored');
            return message;
        }
        const attachments = [];
        let changed = false;
        try {
            for (var _d = true, _e = __asyncValues(message.urls), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const item = _c;
                if (item.ignoreParse === true) {
                    log.debug('URL ignored', item.url);
                    continue;
                }
                const { urlPreview, foundMeta } = yield parseUrl(item.url);
                Object.assign(item, foundMeta ? urlPreview : {});
                changed = changed || foundMeta;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (attachments.length) {
            yield models_1.Messages.setMessageAttachments(message._id, attachments);
        }
        if (changed === true) {
            yield models_1.Messages.setUrlsById(message._id, message.urls);
        }
        return message;
    });
};
const OEmbed = {
    rocketUrlParser,
    getUrlMetaWithCache,
    getUrlMeta,
    parseUrl,
};
exports.OEmbed = OEmbed;
server_1.settings.watch('API_Embed', (value) => {
    if (value) {
        return callbacks_1.callbacks.add('afterSaveMessage', (message) => OEmbed.rocketUrlParser(message), callbacks_1.callbacks.priority.LOW, 'API_Embed');
    }
    return callbacks_1.callbacks.remove('afterSaveMessage', 'API_Embed');
});
