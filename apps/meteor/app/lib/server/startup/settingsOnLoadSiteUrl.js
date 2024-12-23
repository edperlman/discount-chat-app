"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostname = void 0;
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const server_1 = require("../../../settings/server");
server_1.settings.watch('Site_Url', 
// Needed as WebAppInternals.generateBoilerplate needs to be called in a fiber
meteor_1.Meteor.bindEnvironment((value) => {
    var _a;
    if (value == null || value.trim() === '') {
        return;
    }
    let host = value.replace(/\/$/, '');
    // let prefix = '';
    const match = value.match(/([^\/]+\/{2}[^\/]+)(\/.+)/);
    if (match != null) {
        host = match[1];
        // prefix = match[2].replace(/\/$/, '');
    }
    global.__meteor_runtime_config__.ROOT_URL = value;
    if ((_a = meteor_1.Meteor.absoluteUrl.defaultOptions) === null || _a === void 0 ? void 0 : _a.rootUrl) {
        meteor_1.Meteor.absoluteUrl.defaultOptions.rootUrl = value;
    }
    exports.hostname = host.replace(/^https?:\/\//, '');
    process.env.MOBILE_ROOT_URL = host;
    process.env.MOBILE_DDP_URL = host;
    if (typeof webapp_1.WebAppInternals !== 'undefined' && webapp_1.WebAppInternals.generateBoilerplate) {
        return webapp_1.WebAppInternals.generateBoilerplate();
    }
}));
