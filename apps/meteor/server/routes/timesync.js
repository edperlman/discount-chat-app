"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_1 = require("meteor/webapp");
// Use rawConnectHandlers so we get a response as quickly as possible
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
const syncUrl = `${(global === null || global === void 0 ? void 0 : global.ROOT_URL_PATH_PREFIX) || ''}/_timesync`;
webapp_1.WebApp.rawConnectHandlers.use(syncUrl, (_req, res) => {
    // Never ever cache this, otherwise weird times are shown on reload
    // http://stackoverflow.com/q/18811286/586086
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    // Avoid MIME type warnings in browsers
    res.setHeader('Content-Type', 'text/plain');
    res.end(Date.now().toString());
});
