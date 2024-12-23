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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = exports.isFCMCredentials = exports.FCMCredentialsValidationSchema = exports._matchToken = void 0;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const tools_1 = require("@rocket.chat/tools");
const ajv_1 = __importDefault(require("ajv"));
const google_auth_library_1 = require("google-auth-library");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const apn_1 = require("./apn");
const fcm_1 = require("./fcm");
const gcm_1 = require("./gcm");
const logger_1 = require("./logger");
const server_1 = require("../../settings/server");
exports._matchToken = check_1.Match.OneOf({ apn: String }, { gcm: String });
const ajv = new ajv_1.default({
    coerceTypes: true,
});
exports.FCMCredentialsValidationSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
        },
        project_id: {
            type: 'string',
        },
        private_key_id: {
            type: 'string',
        },
        private_key: {
            type: 'string',
        },
        client_email: {
            type: 'string',
        },
        client_id: {
            type: 'string',
        },
        auth_uri: {
            type: 'string',
        },
        token_uri: {
            type: 'string',
        },
        auth_provider_x509_cert_url: {
            type: 'string',
        },
        client_x509_cert_url: {
            type: 'string',
        },
        universe_domain: {
            type: 'string',
        },
    },
    required: ['client_email', 'project_id', 'private_key_id', 'private_key'],
};
exports.isFCMCredentials = ajv.compile(exports.FCMCredentialsValidationSchema);
class PushClass {
    constructor() {
        this.options = {
            uniqueId: '',
        };
        this.isConfigured = false;
    }
    configure(options) {
        this.options = Object.assign({ sendTimeout: 60000 }, options);
        // https://npmjs.org/package/apn
        // After requesting the certificate from Apple, export your private key as
        // a .p12 file anddownload the .cer file from the iOS Provisioning Portal.
        // gateway.push.apple.com, port 2195
        // gateway.sandbox.push.apple.com, port 2195
        // Now, in the directory containing cert.cer and key.p12 execute the
        // following commands to generate your .pem files:
        // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem
        // $ openssl pkcs12 -in key.p12 -out key.pem -nodes
        // Block multiple calls
        if (this.isConfigured) {
            throw new Error('Configure should not be called more than once!');
        }
        this.isConfigured = true;
        logger_1.logger.debug('Configure', this.options);
        if (this.options.apn) {
            (0, apn_1.initAPN)({ options: this.options, absoluteUrl: meteor_1.Meteor.absoluteUrl() });
        }
    }
    replaceToken(currentToken, newToken) {
        void models_1.AppsTokens.updateMany({ token: currentToken }, { $set: { token: newToken } });
    }
    removeToken(token) {
        void models_1.AppsTokens.deleteOne({ token });
    }
    shouldUseGateway() {
        return Boolean(!!this.options.gateways && server_1.settings.get('Register_Server') && server_1.settings.get('Cloud_Service_Agree_PrivacyTerms'));
    }
    sendNotificationNative(app, notification, countApn, countGcm) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            logger_1.logger.debug('send to token', app.token);
            if ('apn' in app.token && app.token.apn) {
                countApn.push(app._id);
                // Send to APN
                if (this.options.apn) {
                    (0, apn_1.sendAPN)({ userToken: app.token.apn, notification: Object.assign({ topic: app.appName }, notification), _removeToken: this.removeToken });
                }
            }
            else if ('gcm' in app.token && app.token.gcm) {
                countGcm.push(app._id);
                // Send to GCM
                // We do support multiple here - so we should construct an array
                // and send it bulk - Investigate limit count of id's
                // TODO: Remove this after the legacy provider is removed
                const useLegacyProvider = server_1.settings.get('Push_UseLegacy');
                if (!useLegacyProvider) {
                    // override this.options.gcm.apiKey with the oauth2 token
                    const { projectId, token } = yield this.getNativeNotificationAuthorizationCredentials();
                    const sendGCMOptions = Object.assign(Object.assign({}, this.options), { gcm: Object.assign(Object.assign({}, this.options.gcm), { apiKey: token, projectNumber: projectId }) });
                    (0, fcm_1.sendFCM)({
                        userTokens: app.token.gcm,
                        notification,
                        _replaceToken: this.replaceToken,
                        _removeToken: this.removeToken,
                        options: sendGCMOptions,
                    });
                }
                else if ((_a = this.options.gcm) === null || _a === void 0 ? void 0 : _a.apiKey) {
                    (0, gcm_1.sendGCM)({
                        userTokens: app.token.gcm,
                        notification,
                        _replaceToken: this.replaceToken,
                        _removeToken: this.removeToken,
                        options: this.options,
                    });
                }
            }
            else {
                throw new Error('send got a faulty query');
            }
        });
    }
    getNativeNotificationAuthorizationCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsString = server_1.settings.get('Push_google_api_credentials');
            if (!credentialsString.trim()) {
                throw new Error('Push_google_api_credentials is not set');
            }
            try {
                const credentials = JSON.parse(credentialsString);
                if (!(0, exports.isFCMCredentials)(credentials)) {
                    throw new Error('Push_google_api_credentials is not in the correct format');
                }
                const client = new google_auth_library_1.JWT({
                    email: credentials.client_email,
                    key: credentials.private_key,
                    keyId: credentials.private_key_id,
                    scopes: 'https://www.googleapis.com/auth/firebase.messaging',
                });
                yield client.authorize();
                return {
                    token: client.credentials.access_token,
                    projectId: credentials.project_id,
                };
            }
            catch (error) {
                logger_1.logger.error('Error getting FCM token', error);
                throw new Error('Error getting FCM token');
            }
        });
    }
    sendGatewayPush(gateway_1, service_1, token_1, notification_1) {
        return __awaiter(this, arguments, void 0, function* (gateway, service, token, notification, tries = 0) {
            notification.uniqueId = this.options.uniqueId;
            const options = Object.assign({ method: 'POST', body: {
                    token,
                    options: notification,
                } }, (token && this.options.getAuthorization && { headers: { Authorization: yield this.options.getAuthorization() } }));
            const result = yield (0, server_fetch_1.serverFetch)(`${gateway}/push/${service}/send`, options);
            const response = yield result.text();
            if (result.status === 406) {
                logger_1.logger.info('removing push token', token);
                yield models_1.AppsTokens.deleteMany({
                    $or: [
                        {
                            'token.apn': token,
                        },
                        {
                            'token.gcm': token,
                        },
                    ],
                });
                return;
            }
            if (result.status === 422) {
                logger_1.logger.info('gateway rejected push notification. not retrying.', response);
                return;
            }
            if (result.status === 401) {
                logger_1.logger.warn('Error sending push to gateway (not authorized)', response);
                return;
            }
            if (result.ok) {
                return;
            }
            logger_1.logger.error({ msg: `Error sending push to gateway (${tries} try) ->`, err: response });
            if (tries <= 4) {
                // [1, 2, 4, 8, 16] minutes (total 31)
                const ms = 60000 * Math.pow(2, tries);
                logger_1.logger.log('Trying sending push to gateway again in', ms, 'milliseconds');
                setTimeout(() => this.sendGatewayPush(gateway, service, token, notification, tries + 1), ms);
            }
        });
    }
    getGatewayNotificationData(notification) {
        // Gateway currently accepts every attribute from the PendingPushNotification type, except for the priority
        // If new attributes are added to the PendingPushNotification type, they'll need to be removed here as well.
        const { priority: _priority } = notification, notifData = __rest(notification, ["priority"]);
        return Object.assign({}, notifData);
    }
    sendNotificationGateway(app, notification, countApn, countGcm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.gateways) {
                return;
            }
            const gatewayNotification = this.getGatewayNotificationData(notification);
            for (const gateway of this.options.gateways) {
                logger_1.logger.debug('send to token', app.token);
                if ('apn' in app.token && app.token.apn) {
                    countApn.push(app._id);
                    return this.sendGatewayPush(gateway, 'apn', app.token.apn, Object.assign({ topic: app.appName }, gatewayNotification));
                }
                if ('gcm' in app.token && app.token.gcm) {
                    countGcm.push(app._id);
                    return this.sendGatewayPush(gateway, 'gcm', app.token.gcm, gatewayNotification);
                }
            }
        });
    }
    sendNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            logger_1.logger.debug('Sending notification', notification);
            const countApn = [];
            const countGcm = [];
            if (notification.from !== String(notification.from)) {
                throw new Error('Push.send: option "from" not a string');
            }
            if (notification.title !== String(notification.title)) {
                throw new Error('Push.send: option "title" not a string');
            }
            if (notification.text !== String(notification.text)) {
                throw new Error('Push.send: option "text" not a string');
            }
            logger_1.logger.debug(`send message "${notification.title}" to userId`, notification.userId);
            const query = {
                userId: notification.userId,
                $or: [{ 'token.apn': { $exists: true } }, { 'token.gcm': { $exists: true } }],
            };
            const appTokens = models_1.AppsTokens.find(query);
            try {
                for (var _d = true, appTokens_1 = __asyncValues(appTokens), appTokens_1_1; appTokens_1_1 = yield appTokens_1.next(), _a = appTokens_1_1.done, !_a; _d = true) {
                    _c = appTokens_1_1.value;
                    _d = false;
                    const app = _c;
                    logger_1.logger.debug('send to token', app.token);
                    if (this.shouldUseGateway()) {
                        yield this.sendNotificationGateway(app, notification, countApn, countGcm);
                        continue;
                    }
                    yield this.sendNotificationNative(app, notification, countApn, countGcm);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = appTokens_1.return)) yield _b.call(appTokens_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (server_1.settings.get('Log_Level') === '2') {
                logger_1.logger.debug(`Sent message "${notification.title}" to ${countApn.length} ios apps ${countGcm.length} android apps`);
                // Add some verbosity about the send result, making sure the developer
                // understands what just happened.
                if (!countApn.length && !countGcm.length) {
                    if ((yield models_1.AppsTokens.col.estimatedDocumentCount()) === 0) {
                        logger_1.logger.debug('GUIDE: The "AppsTokens" is empty - No clients have registered on the server yet...');
                    }
                }
                else if (!countApn.length) {
                    if ((yield models_1.AppsTokens.countApnTokens()) === 0) {
                        logger_1.logger.debug('GUIDE: The "AppsTokens" - No APN clients have registered on the server yet...');
                    }
                }
                else if (!countGcm.length) {
                    if ((yield models_1.AppsTokens.countGcmTokens()) === 0) {
                        logger_1.logger.debug('GUIDE: The "AppsTokens" - No GCM clients have registered on the server yet...');
                    }
                }
            }
            return {
                apn: countApn,
                gcm: countGcm,
            };
        });
    }
    // This is a general function to validate that the data added to notifications
    // is in the correct format. If not this function will throw errors
    _validateDocument(notification) {
        // Check the general notification
        (0, check_1.check)(notification, {
            from: String,
            title: String,
            text: String,
            sent: check_1.Match.Optional(Boolean),
            sending: check_1.Match.Optional(check_1.Match.Integer),
            badge: check_1.Match.Optional(check_1.Match.Integer),
            sound: check_1.Match.Optional(String),
            notId: check_1.Match.Optional(check_1.Match.Integer),
            contentAvailable: check_1.Match.Optional(check_1.Match.Integer),
            apn: check_1.Match.Optional({
                category: check_1.Match.Optional(String),
            }),
            gcm: check_1.Match.Optional({
                image: check_1.Match.Optional(String),
                style: check_1.Match.Optional(String),
            }),
            userId: String,
            payload: check_1.Match.Optional(Object),
            createdAt: Date,
            createdBy: check_1.Match.OneOf(String, null),
            priority: check_1.Match.Optional(check_1.Match.Integer),
        });
        if (!notification.userId) {
            throw new Error('No userId found');
        }
    }
    hasApnOptions(options) {
        return check_1.Match.test(options.apn, Object);
    }
    hasGcmOptions(options) {
        return check_1.Match.test(options.gcm, Object);
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = Object.assign(Object.assign(Object.assign({ createdAt: new Date(), 
                // createdBy is no longer used, but the gateway still expects it
                createdBy: '<SERVER>', sent: false, sending: 0 }, (0, tools_1.pick)(options, 'from', 'title', 'text', 'userId', 'payload', 'badge', 'sound', 'notId', 'priority')), (this.hasApnOptions(options)
                ? {
                    apn: Object.assign({}, (0, tools_1.pick)(options.apn, 'category')),
                }
                : {})), (this.hasGcmOptions(options)
                ? {
                    gcm: Object.assign({}, (0, tools_1.pick)(options.gcm, 'image', 'style')),
                }
                : {}));
            // Validate the notification
            this._validateDocument(notification);
            try {
                yield this.sendNotification(notification);
            }
            catch (error) {
                logger_1.logger.debug(`Could not send notification to user "${notification.userId}", Error: ${error.message}`);
                logger_1.logger.debug(error.stack);
            }
        });
    }
}
exports.Push = new PushClass();
