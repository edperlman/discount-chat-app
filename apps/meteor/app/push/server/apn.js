"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAPN = exports.sendAPN = void 0;
const apn_1 = __importDefault(require("apn"));
const ejson_1 = __importDefault(require("ejson"));
const logger_1 = require("./logger");
let apnConnection;
const sendAPN = ({ userToken, notification, _removeToken, }) => {
    var _a;
    if (!apnConnection) {
        throw new Error('Apn Connection not initialized.');
    }
    const priority = notification.priority || notification.priority === 0 ? notification.priority : 10;
    const note = new apn_1.default.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    if (notification.badge !== undefined) {
        note.badge = notification.badge;
    }
    if (notification.sound !== undefined) {
        note.sound = notification.sound;
    }
    if (notification.contentAvailable != null) {
        note.setContentAvailable(notification.contentAvailable);
    }
    // adds category support for iOS8 custom actions as described here:
    // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/
    // RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36
    note.category = (_a = notification.apn) === null || _a === void 0 ? void 0 : _a.category;
    note.body = notification.text;
    note.title = notification.title;
    if (notification.notId != null) {
        note.threadId = String(notification.notId);
    }
    // Allow the user to set payload data
    note.payload = notification.payload ? { ejson: ejson_1.default.stringify(notification.payload) } : {};
    note.payload.messageFrom = notification.from;
    note.priority = priority;
    note.topic = notification.topic;
    note.mutableContent = true;
    void apnConnection.send(note, userToken).then((response) => {
        response.failed.forEach((failure) => {
            var _a;
            logger_1.logger.debug(`Got error code ${failure.status} for token ${userToken}`);
            if (['400', '410'].includes((_a = failure.status) !== null && _a !== void 0 ? _a : '')) {
                logger_1.logger.debug(`Removing token ${userToken}`);
                _removeToken({
                    apn: userToken,
                });
            }
        });
    });
};
exports.sendAPN = sendAPN;
const initAPN = ({ options, absoluteUrl }) => {
    var _a, _b;
    logger_1.logger.debug('APN configured');
    if (options.apn.gateway) {
        // We check the apn gateway i the options, we could risk shipping
        // server into production while using the production configuration.
        // On the other hand we could be in development but using the production
        // configuration. And finally we could have configured an unknown apn
        // gateway (this could change in the future - but a warning about typos
        // can save hours of debugging)
        //
        // Warn about gateway configurations - it's more a guide
        if (options.apn.gateway === 'gateway.sandbox.push.apple.com') {
            // Using the development sandbox
            logger_1.logger.warn('WARNING: Push APN is in development mode');
        }
        else if (options.apn.gateway === 'gateway.push.apple.com') {
            // In production - but warn if we are running on localhost
            if (/http:\/\/localhost/.test(absoluteUrl)) {
                logger_1.logger.warn('WARNING: Push APN is configured to production mode - but server is running from localhost');
            }
        }
        else {
            // Warn about gateways we dont know about
            logger_1.logger.warn(`WARNING: Push APN unknown gateway "${options.apn.gateway}"`);
        }
    }
    else if (options.production) {
        if (/http:\/\/localhost/.test(absoluteUrl)) {
            logger_1.logger.warn('WARNING: Push APN is configured to production mode - but server is running from localhost');
        }
    }
    else {
        logger_1.logger.warn('WARNING: Push APN is in development mode');
    }
    // Check certificate data
    if (!((_a = options.apn.cert) === null || _a === void 0 ? void 0 : _a.length)) {
        logger_1.logger.error('ERROR: Push server could not find cert');
    }
    // Check key data
    if (!((_b = options.apn.key) === null || _b === void 0 ? void 0 : _b.length)) {
        logger_1.logger.error('ERROR: Push server could not find key');
    }
    // Rig apn connection
    try {
        apnConnection = new apn_1.default.Provider(options.apn);
    }
    catch (err) {
        logger_1.logger.error({ msg: 'Error trying to initialize APN', err });
    }
};
exports.initAPN = initAPN;
