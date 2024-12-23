"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyHeadInjections = exports.injectIntoBody = exports.addStyle = exports.addScript = exports.injectIntoHead = exports.headInjections = void 0;
const crypto_1 = __importDefault(require("crypto"));
const meteorhacks_inject_initial_1 = require("meteor/meteorhacks:inject-initial");
const reactive_dict_1 = require("meteor/reactive-dict");
const webapp_1 = require("meteor/webapp");
const parseurl_1 = __importDefault(require("parseurl"));
const getURL_1 = require("../../utils/server/getURL");
exports.headInjections = new reactive_dict_1.ReactiveDict();
const callback = (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        next();
        return;
    }
    try {
        const rawPath = (0, parseurl_1.default)(req);
        const pathname = (rawPath === null || rawPath === void 0 ? void 0 : rawPath.pathname) && decodeURIComponent(rawPath.pathname);
        if (!pathname) {
            next();
            return;
        }
        const injection = exports.headInjections.get(pathname.replace(/^\//, '').split('_')[0]);
        if (!injection || typeof injection === 'string') {
            next();
            return;
        }
        const serve = (contentType) => (content, cacheControl = 'public, max-age=31536000') => {
            res.writeHead(200, {
                'Content-type': contentType,
                'cache-control': cacheControl,
                'Content-Length': content.length,
            });
            res.write(content);
            res.end();
        };
        const serveStaticJS = serve('application/javascript; charset=UTF-8');
        const serveStaticCSS = serve('text/css; charset=UTF-8');
        if (injection.type === 'JS') {
            serveStaticJS(injection.content);
            return;
        }
        if (injection.type === 'CSS') {
            serveStaticCSS(injection.content);
            return;
        }
        next();
    }
    catch (e) {
        next();
    }
};
webapp_1.WebApp.connectHandlers.use(callback);
const injectIntoHead = (key, value) => {
    exports.headInjections.set(key, value);
};
exports.injectIntoHead = injectIntoHead;
const addScript = (key, content) => {
    if (/_/.test(key)) {
        throw new Error('inject.js > addScript - key cannot contain "_" (underscore)');
    }
    if (!content.trim()) {
        (0, exports.injectIntoHead)(key, '');
        return;
    }
    const currentHash = crypto_1.default.createHash('sha1').update(content).digest('hex');
    (0, exports.injectIntoHead)(key, {
        type: 'JS',
        tag: `<script id="${key}" type="text/javascript" src="${`${(0, getURL_1.getURL)(key)}_${currentHash}.js`}"></script>`,
        content,
    });
};
exports.addScript = addScript;
const addStyle = (key, content) => {
    if (/_/.test(key)) {
        throw new Error('inject.js > addStyle - key cannot contain "_" (underscore)');
    }
    if (!content.trim()) {
        (0, exports.injectIntoHead)(key, '');
        return;
    }
    const currentHash = crypto_1.default.createHash('sha1').update(content).digest('hex');
    (0, exports.injectIntoHead)(key, {
        type: 'CSS',
        tag: `<link id="${key}" rel="stylesheet" type="text/css" href="${`${(0, getURL_1.getURL)(key)}_${currentHash}.css`}">`,
        content,
    });
};
exports.addStyle = addStyle;
const injectIntoBody = (key, value) => {
    meteorhacks_inject_initial_1.Inject.rawBody(key, value);
};
exports.injectIntoBody = injectIntoBody;
const applyHeadInjections = (injections) => {
    if (injections.length === 0) {
        return (html) => html;
    }
    const replacementHtml = `${injections
        .map((i) => {
        if (typeof i === 'string') {
            return i;
        }
        return i.content.trim().length > 0 ? i.tag : '';
    })
        .join('\n')
        .replace(/\$/g, '$$$$')}\n</head>`;
    return (html) => html.replace('</head>', replacementHtml);
};
exports.applyHeadInjections = applyHeadInjections;
