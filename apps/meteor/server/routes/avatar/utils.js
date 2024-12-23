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
exports.renderSVGLetters = exports.wasFallbackModified = exports.serveSvgAvatarInRequestedFormat = exports.getAvatarSizeFromRequest = exports.serveAvatarFile = exports.MIN_SVG_AVATAR_SIZE = exports.MAX_SVG_AVATAR_SIZE = void 0;
exports.userCanAccessAvatar = userCanAccessAvatar;
exports.setCacheAndDispositionHeaders = setCacheAndDispositionHeaders;
const account_utils_1 = require("@rocket.chat/account-utils");
const models_1 = require("@rocket.chat/models");
const ostrio_cookies_1 = require("meteor/ostrio:cookies");
const sharp_1 = __importDefault(require("sharp"));
const underscore_1 = require("underscore");
const server_1 = require("../../../app/file-upload/server");
const server_2 = require("../../../app/settings/server");
const getAvatarColor_1 = require("../../../app/utils/lib/getAvatarColor");
const FALLBACK_LAST_MODIFIED = 'Thu, 01 Jan 2015 00:00:00 GMT';
const cookie = new ostrio_cookies_1.Cookies();
exports.MAX_SVG_AVATAR_SIZE = 1024;
exports.MIN_SVG_AVATAR_SIZE = 16;
const serveAvatarFile = (file, req, res, next) => {
    var _a, _b;
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    const reqModifiedHeader = req.headers['if-modified-since'];
    if (reqModifiedHeader && reqModifiedHeader === ((_a = file.uploadedAt) === null || _a === void 0 ? void 0 : _a.toUTCString())) {
        res.setHeader('Last-Modified', reqModifiedHeader);
        res.writeHead(304);
        res.end();
        return;
    }
    if (file.uploadedAt) {
        res.setHeader('Last-Modified', (_b = file.uploadedAt) === null || _b === void 0 ? void 0 : _b.toUTCString());
    }
    if (file.type) {
        res.setHeader('Content-Type', file.type);
    }
    if (file.size) {
        res.setHeader('Content-Length', file.size);
    }
    return server_1.FileUpload.get(file, req, res, next);
};
exports.serveAvatarFile = serveAvatarFile;
const getAvatarSizeFromRequest = (req) => {
    const requestSize = req.query.size && parseInt(req.query.size);
    if (!requestSize) {
        return;
    }
    return Math.min(Math.max(requestSize, exports.MIN_SVG_AVATAR_SIZE), exports.MAX_SVG_AVATAR_SIZE);
};
exports.getAvatarSizeFromRequest = getAvatarSizeFromRequest;
const serveSvgAvatarInRequestedFormat = ({ nameOrUsername, req, res, }) => {
    const size = (0, exports.getAvatarSizeFromRequest)(req);
    const avatar = (0, exports.renderSVGLetters)(nameOrUsername, size);
    res.setHeader('Last-Modified', FALLBACK_LAST_MODIFIED);
    const { format } = req.query;
    if (['png', 'jpg', 'jpeg'].includes(format)) {
        res.setHeader('Content-Type', `image/${format}`);
        (0, sharp_1.default)(Buffer.from(avatar)).toFormat(format).pipe(res);
        return;
    }
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(avatar);
    res.end();
};
exports.serveSvgAvatarInRequestedFormat = serveSvgAvatarInRequestedFormat;
const wasFallbackModified = (reqModifiedHeader) => {
    if (!reqModifiedHeader || reqModifiedHeader !== FALLBACK_LAST_MODIFIED) {
        return true;
    }
    return false;
};
exports.wasFallbackModified = wasFallbackModified;
function isUserAuthenticated(_a) {
    return __awaiter(this, arguments, void 0, function* ({ headers, query }) {
        let { rc_uid, rc_token } = query;
        if (!rc_uid && headers.cookie) {
            rc_uid = cookie.get('rc_uid', headers.cookie);
            rc_token = cookie.get('rc_token', headers.cookie);
        }
        if (rc_uid == null || rc_token == null) {
            return false;
        }
        const userFound = yield models_1.Users.findOneByIdAndLoginToken(rc_uid, (0, account_utils_1.hashLoginToken)(rc_token), { projection: { _id: 1 } }); // TODO memoize find
        return !!userFound;
    });
}
const warnUnauthenticatedAccess = (0, underscore_1.throttle)(() => {
    console.warn('The server detected an unauthenticated access to an user avatar. This type of request will soon be blocked by default.');
}, 60000 * 30); // 30 minutes
function userCanAccessAvatar(_a) {
    return __awaiter(this, arguments, void 0, function* ({ headers = {}, query = {} }) {
        if (!server_2.settings.get('Accounts_AvatarBlockUnauthenticatedAccess')) {
            return true;
        }
        const isAuthenticated = yield isUserAuthenticated({ headers, query });
        if (!isAuthenticated) {
            warnUnauthenticatedAccess();
        }
        return isAuthenticated;
    });
}
const getFirstLetter = (name) => name
    .replace(/[^A-Za-z0-9]/g, '')
    .substr(0, 1)
    .toUpperCase();
const renderSVGLetters = (username, viewSize = 200) => {
    let color = '';
    let initials = '';
    if (username === '?') {
        color = '#000';
        initials = username;
    }
    else {
        color = (0, getAvatarColor_1.getAvatarColor)(username);
        initials = getFirstLetter(username);
    }
    const fontSize = viewSize / 1.6;
    return `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${viewSize} ${viewSize}\">\n<rect width=\"100%\" height=\"100%\" fill=\"${color}\"/>\n<text x=\"50%\" y=\"50%\" dy=\"0.36em\" text-anchor=\"middle\" pointer-events=\"none\" fill=\"#ffffff\" font-family=\"'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'\" font-size="${fontSize}">\n${initials}\n</text>\n</svg>`;
};
exports.renderSVGLetters = renderSVGLetters;
const getCacheTime = (cacheTime) => cacheTime || server_2.settings.get('Accounts_AvatarCacheTime');
function setCacheAndDispositionHeaders(req, res) {
    const cacheTime = getCacheTime(req.query.cacheTime);
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    res.setHeader('Content-Disposition', 'inline');
}
