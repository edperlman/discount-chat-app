"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGCM = void 0;
const ejson_1 = __importDefault(require("ejson"));
const node_gcm_1 = __importDefault(require("node-gcm"));
const logger_1 = require("./logger");
/**
 * @deprecated Use sendFCM instead, node-gcm is deprecated and google will remove it soon
 */
const sendGCM = function ({ userTokens, notification, _replaceToken, _removeToken, options }) {
    var _a, _b, _c, _d;
    // Make sure userTokens are an array of strings
    if (typeof userTokens === 'string') {
        userTokens = [userTokens];
    }
    // Check if any tokens in there to send
    if (!userTokens.length) {
        logger_1.logger.debug('sendGCM no push tokens found');
        return;
    }
    logger_1.logger.debug('sendGCM', userTokens, notification);
    // Allow user to set payload
    const data = notification.payload ? { ejson: ejson_1.default.stringify(notification.payload) } : {};
    data.title = notification.title;
    data.message = notification.text;
    // Set image
    if (((_a = notification.gcm) === null || _a === void 0 ? void 0 : _a.image) != null) {
        data.image = (_b = notification.gcm) === null || _b === void 0 ? void 0 : _b.image;
    }
    // Set extra details
    if (notification.badge != null) {
        data.msgcnt = notification.badge;
    }
    if (notification.sound != null) {
        data.soundname = notification.sound;
    }
    if (notification.notId != null) {
        data.notId = notification.notId;
    }
    if (((_c = notification.gcm) === null || _c === void 0 ? void 0 : _c.style) != null) {
        data.style = (_d = notification.gcm) === null || _d === void 0 ? void 0 : _d.style;
    }
    if (notification.contentAvailable != null) {
        data['content-available'] = notification.contentAvailable;
    }
    const message = new node_gcm_1.default.Message({
        collapseKey: notification.from,
        // Requires delivery of real-time messages to users while device is in Doze or app is in App Standby.
        // https://developer.android.com/training/monitoring-device-state/doze-standby#exemption-cases
        priority: 'high',
        //    delayWhileIdle: true,
        //    timeToLive: 4,
        //    restricted_package_name: 'dk.gi2.app'
        data,
    });
    logger_1.logger.debug(`Create GCM Sender using "${options.gcm.apiKey}"`);
    const sender = new node_gcm_1.default.Sender(options.gcm.apiKey);
    userTokens.forEach((value) => logger_1.logger.debug(`A:Send message to: ${value}`));
    const userToken = userTokens.length === 1 ? userTokens[0] : null;
    sender.send(message, userTokens, 5, (err, result) => {
        var _a;
        if (err) {
            logger_1.logger.debug({ msg: 'ANDROID ERROR: result of sender', result });
            return;
        }
        if (result === null) {
            logger_1.logger.debug('ANDROID: Result of sender is null');
            return;
        }
        logger_1.logger.debug({ msg: 'ANDROID: Result of sender', result });
        if (result.canonical_ids === 1 && userToken && ((_a = result.results) === null || _a === void 0 ? void 0 : _a[0].registration_id)) {
            // This is an old device, token is replaced
            try {
                _replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });
            }
            catch (err) {
                logger_1.logger.error({ msg: 'Error replacing token', err });
            }
        }
        // We cant send to that token - might not be registered
        // ask the user to remove the token from the list
        if (result.failure !== 0 && userToken) {
            // This is an old device, token is replaced
            try {
                _removeToken({ gcm: userToken });
            }
            catch (err) {
                logger_1.logger.error({ msg: 'Error removing token', err });
            }
        }
    });
};
exports.sendGCM = sendGCM;
