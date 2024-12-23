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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const url_1 = __importDefault(require("url"));
const logger_1 = require("@rocket.chat/logger");
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const server_1 = require("../../settings/server");
const logger = new logger_1.Logger('CORS');
let templatePromise;
server_1.settings.watch('Enable_CSP', meteor_1.Meteor.bindEnvironment((enabled) => __awaiter(void 0, void 0, void 0, function* () {
    templatePromise = webapp_1.WebAppInternals.setInlineScriptsAllowed(!enabled);
})));
webapp_1.WebApp.rawConnectHandlers.use((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (templatePromise) {
        yield templatePromise;
        templatePromise = void 0;
    }
    // XSS Protection for old browsers (IE)
    res.setHeader('X-XSS-Protection', '1');
    // X-Content-Type-Options header to prevent MIME Sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (server_1.settings.get('Iframe_Restrict_Access')) {
        res.setHeader('X-Frame-Options', server_1.settings.get('Iframe_X_Frame_Options'));
    }
    if (server_1.settings.get('Enable_CSP')) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const cdn_prefixes = [
            server_1.settings.get('CDN_PREFIX'),
            server_1.settings.get('CDN_PREFIX_ALL') ? null : server_1.settings.get('CDN_JSCSS_PREFIX'),
        ]
            .filter(Boolean)
            .join(' ');
        const inlineHashes = [
            // Hash for `window.close()`, required by the CAS login popup.
            "'sha256-jqxtvDkBbRAl9Hpqv68WdNOieepg8tJSYu1xIy7zT34='",
            // Hash for /apps/meteor/packages/rocketchat-livechat/assets/demo.html:25
            "'sha256-aui5xYk3Lu1dQcnsPlNZI+qDTdfzdUv3fzsw80VLJgw='",
        ]
            .filter(Boolean)
            .join(' ');
        const external = [
            server_1.settings.get('Accounts_OAuth_Apple') && 'https://appleid.cdn-apple.com',
            server_1.settings.get('PiwikAnalytics_enabled') && server_1.settings.get('PiwikAnalytics_url'),
            server_1.settings.get('GoogleAnalytics_enabled') && 'https://www.google-analytics.com',
            ...server_1.settings
                .get('Extra_CSP_Domains')
                .split(/[ \n\,]/gim)
                .filter((e) => Boolean(e.trim())),
        ]
            .filter(Boolean)
            .join(' ');
        res.setHeader('Content-Security-Policy', [
            `default-src 'self' ${cdn_prefixes}`,
            'connect-src *',
            `font-src 'self' ${cdn_prefixes} data:`,
            'frame-src *',
            'img-src * data: blob:',
            'media-src * data:',
            `script-src 'self' 'unsafe-eval' ${inlineHashes} ${cdn_prefixes} ${external}`,
            `style-src 'self' 'unsafe-inline' ${cdn_prefixes}`,
        ].join('; '));
    }
    return next();
}));
const _staticFilesMiddleware = webapp_1.WebAppInternals.staticFilesMiddleware;
let cachingVersion = '';
server_1.settings.watch('Troubleshoot_Force_Caching_Version', (value) => {
    cachingVersion = String(value).trim();
});
// @ts-expect-error - accessing internal property of webapp
webapp_1.WebAppInternals.staticFilesMiddleware = function (staticFiles, req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { arch, path, url } = webapp_1.WebApp.categorizeRequest(req);
    if (cachingVersion && req.cookies.cache_version !== cachingVersion) {
        res.cookie('cache_version', cachingVersion);
        res.setHeader('Clear-Site-Data', '"cache"');
    }
    // Prevent meteor_runtime_config.js to load from a different expected hash possibly causing
    // a cache of the file for the wrong hash and start a client loop due to the mismatch
    // of the hashes of ui versions which would be checked against a websocket response
    if (path === '/meteor_runtime_config.js') {
        const program = webapp_1.WebApp.clientPrograms[arch];
        if (!(program === null || program === void 0 ? void 0 : program.meteorRuntimeConfigHash)) {
            program.meteorRuntimeConfigHash = (0, crypto_1.createHash)('sha1')
                .update(JSON.stringify(encodeURIComponent(program.meteorRuntimeConfig)))
                .digest('hex');
        }
        if (program.meteorRuntimeConfigHash !== url.query.hash) {
            res.writeHead(404);
            return res.end();
        }
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    return _staticFilesMiddleware(staticFiles, req, res, next);
};
const oldHttpServerListeners = webapp_1.WebApp.httpServer.listeners('request').slice(0);
webapp_1.WebApp.httpServer.removeAllListeners('request');
webapp_1.WebApp.httpServer.addListener('request', (req, res, ...args) => {
    const next = () => {
        for (const oldListener of oldHttpServerListeners) {
            oldListener.apply(webapp_1.WebApp.httpServer, [req, res, ...args]);
        }
    };
    if (server_1.settings.get('Force_SSL') !== true) {
        next();
        return;
    }
    const remoteAddress = req.connection.remoteAddress || req.socket.remoteAddress || '';
    const localhostRegexp = /^\s*(127\.0\.0\.1|::1)\s*$/;
    const localhostTest = function (x) {
        return localhostRegexp.test(x);
    };
    const isLocal = localhostRegexp.test(remoteAddress) &&
        (!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'].split(',').every(localhostTest));
    // @ts-expect-error - `pair` is valid, but doesnt exists on types
    const isSsl = req.connection.pair || (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].indexOf('https') !== -1);
    logger.debug('req.url', req.url);
    logger.debug('remoteAddress', remoteAddress);
    logger.debug('isLocal', isLocal);
    logger.debug('isSsl', isSsl);
    logger.debug('req.headers', req.headers);
    if (!isLocal && !isSsl) {
        let host = req.headers.host || url_1.default.parse(meteor_1.Meteor.absoluteUrl()).hostname || '';
        host = host.replace(/:\d+$/, '');
        res.writeHead(302, {
            Location: `https://${host}${req.url}`,
        });
        res.end();
        return;
    }
    return next();
});
