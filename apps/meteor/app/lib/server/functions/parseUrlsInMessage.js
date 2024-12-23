"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrlsInMessage = void 0;
const getMessageUrlRegex_1 = require("../../../../lib/getMessageUrlRegex");
const server_1 = require("../../../markdown/server");
const server_2 = require("../../../settings/server");
// TODO move this function to message service to be used like a "beforeSaveMessage" hook
const parseUrlsInMessage = (message, previewUrls) => {
    var _a;
    if (message.parseUrls === false) {
        return message;
    }
    message.html = message.msg;
    message = server_1.Markdown.code(message);
    const urls = ((_a = message.html) === null || _a === void 0 ? void 0 : _a.match((0, getMessageUrlRegex_1.getMessageUrlRegex)())) || [];
    if (urls) {
        message.urls = [...new Set(urls)].map((url) => (Object.assign({ url, meta: {} }, (previewUrls && !previewUrls.includes(url) && !url.includes(server_2.settings.get('Site_Url')) && { ignoreParse: true }))));
    }
    message = server_1.Markdown.mountTokensBack(message, false);
    message.msg = message.html || message.msg;
    delete message.html;
    delete message.tokens;
};
exports.parseUrlsInMessage = parseUrlsInMessage;
