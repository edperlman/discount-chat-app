"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = __importDefault(require("@bugsnag/js"));
const logger_1 = require("@rocket.chat/logger");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const logger = new logger_1.Logger('bugsnag');
const originalMeteorDebug = meteor_1.Meteor._debug;
function _bugsnagDebug(message, stack, ...args) {
    if (stack instanceof Error) {
        js_1.default.notify(stack, (event) => {
            event.context = message;
        });
    }
    else {
        if (typeof stack === 'string') {
            message += ` ${stack}`;
        }
        const error = new Error(message);
        error.stack = stack;
        js_1.default.notify(error);
    }
    return originalMeteorDebug(message, stack, ...args);
}
server_1.settings.watch('Bugsnag_api_key', (value) => {
    if (!value) {
        return;
    }
    js_1.default.start({
        apiKey: value,
        appVersion: rocketchat_info_1.Info.version,
        logger,
        metadata: rocketchat_info_1.Info,
    });
    meteor_1.Meteor._debug = _bugsnagDebug;
});
