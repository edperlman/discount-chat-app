"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const jsdom_1 = __importDefault(require("jsdom"));
const mem_1 = __importDefault(require("mem"));
const webapp_1 = require("meteor/webapp");
const server_1 = require("../../settings/server");
const Assets_1 = require("../lib/Assets");
const indexHtmlWithServerURL = (0, Assets_1.addServerUrlToIndex)((await Assets.getTextAsync('livechat/index.html')) || '');
function parseExtraAttributes(widgetData) {
    const liveChatAdditionalScripts = server_1.settings.get('Livechat_AdditionalWidgetScripts');
    const additionalClass = server_1.settings.get('Livechat_WidgetLayoutClasses');
    if (liveChatAdditionalScripts == null || additionalClass == null) {
        return widgetData;
    }
    const domParser = new jsdom_1.default.JSDOM(widgetData);
    const doc = domParser.window.document;
    const head = doc.querySelector('head');
    const body = doc.querySelector('body');
    liveChatAdditionalScripts.split(',').forEach((script) => {
        const scriptElement = doc.createElement('script');
        scriptElement.src = script;
        body === null || body === void 0 ? void 0 : body.appendChild(scriptElement);
    });
    additionalClass.split(',').forEach((css) => {
        const linkElement = doc.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = css;
        head === null || head === void 0 ? void 0 : head.appendChild(linkElement);
    });
    return doc.documentElement.innerHTML;
}
const memoizedParseExtraAttributes = (0, mem_1.default)(parseExtraAttributes, { maxAge: process.env.TEST_MODE === 'true' ? 1 : 60000 });
webapp_1.WebApp.connectHandlers.use('/livechat', (req, res, next) => {
    if (!req.url) {
        return next();
    }
    const reqUrl = url_1.default.parse(req.url);
    if (reqUrl.pathname !== '/') {
        return next();
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    const domainWhiteListSetting = server_1.settings.get('Livechat_AllowedDomainsList');
    let domainWhiteList = [];
    if (req.headers.referer && domainWhiteListSetting.trim()) {
        domainWhiteList = domainWhiteListSetting.split(',').map((domain) => domain.trim());
        const referer = url_1.default.parse(req.headers.referer);
        if (referer.host && !domainWhiteList.includes(referer.host)) {
            res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
            return next();
        }
        res.setHeader('Content-Security-Policy', `frame-ancestors ${referer.protocol}//${referer.host}`);
    }
    else {
        // TODO need to remove inline scripts from this route to be able to enable CSP here as well
        res.removeHeader('Content-Security-Policy');
    }
    res.write(memoizedParseExtraAttributes(indexHtmlWithServerURL));
    res.end();
});
