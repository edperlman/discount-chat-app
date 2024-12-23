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
exports.sendFCM = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const ejson_1 = __importDefault(require("ejson"));
const logger_1 = require("./logger");
/**
 * Send a push notification using Firebase Cloud Messaging (FCM).
 * implements the Firebase Cloud Messaging HTTP v1 API, and all of its retry logic,
 * see: https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
 *
 * Errors:
 * - For 400, 401, 403 errors: abort, and do not retry.
 * - For 404 errors: remove the token from the database.
 * - For 429 errors: retry after waiting for the duration set in the retry-after header. If no retry-after header is set, default to 60 seconds.
 * - For 500 errors: retry with exponential backoff.
 */
function fetchWithRetry(url_1, _removeToken_1, options_1) {
    return __awaiter(this, arguments, void 0, function* (url, _removeToken, options, retries = 0) {
        const MAX_RETRIES = 5;
        const response = yield (0, server_fetch_1.serverFetch)(url, options);
        if (response.ok) {
            return response;
        }
        if (retries >= MAX_RETRIES) {
            logger_1.logger.error('sendFCM error: max retries reached');
            return response;
        }
        const retryAfter = response.headers.get('retry-after');
        const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        if (response.status === 404) {
            _removeToken();
            return response;
        }
        if (response.status === 429) {
            yield new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
            return fetchWithRetry(url, _removeToken, options, retries + 1);
        }
        if (response.status >= 500 && response.status < 600) {
            const backoff = Math.pow(2, retries) * 10000;
            yield new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetry(url, _removeToken, options, retries + 1);
        }
        const error = yield response.json();
        logger_1.logger.error('sendFCM error', error);
        return response;
    });
}
function getFCMMessagesFromPushData(userTokens, notification) {
    var _a, _b, _c, _d;
    // first we will get the `data` field from the notification
    const data = notification.payload ? { ejson: ejson_1.default.stringify(notification.payload) } : {};
    // Set image
    if ((_a = notification.gcm) === null || _a === void 0 ? void 0 : _a.image) {
        data.image = (_b = notification.gcm) === null || _b === void 0 ? void 0 : _b.image;
    }
    // Set extra details
    if (notification.badge) {
        data.msgcnt = notification.badge.toString();
    }
    if (notification.sound) {
        data.soundname = notification.sound;
    }
    if (notification.notId) {
        data.notId = notification.notId.toString();
    }
    if ((_c = notification.gcm) === null || _c === void 0 ? void 0 : _c.style) {
        data.style = (_d = notification.gcm) === null || _d === void 0 ? void 0 : _d.style;
    }
    if (notification.contentAvailable) {
        data['content-available'] = notification.contentAvailable.toString();
    }
    // then we will create the notification field
    const notificationField = {
        title: notification.title,
        body: notification.text,
    };
    // then we will create the message
    const message = {
        notification: notificationField,
        data,
        android: {
            priority: 'HIGH',
        },
    };
    // then we will create the message for each token
    return userTokens.map((token) => ({ message: Object.assign(Object.assign({}, message), { token }) }));
}
const sendFCM = function ({ userTokens, notification, _removeToken, options }) {
    const tokens = typeof userTokens === 'string' ? [userTokens] : userTokens;
    if (!tokens.length) {
        logger_1.logger.log('sendFCM no push tokens found');
        return;
    }
    logger_1.logger.debug('sendFCM', tokens, notification);
    const messages = getFCMMessagesFromPushData(tokens, notification);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.gcm.apiKey}`,
        'access_token_auth': true,
    };
    if (!options.gcm.projectNumber.trim()) {
        logger_1.logger.error('sendFCM error: GCM project number is missing');
        return;
    }
    const url = `https://fcm.googleapis.com/v1/projects/${options.gcm.projectNumber}/messages:send`;
    for (const fcmRequest of messages) {
        logger_1.logger.debug('sendFCM message', fcmRequest);
        const removeToken = () => {
            const { token } = fcmRequest.message;
            token && _removeToken({ gcm: token });
        };
        const response = fetchWithRetry(url, removeToken, { method: 'POST', headers, body: JSON.stringify(fcmRequest) });
        response.catch((err) => {
            logger_1.logger.error('sendFCM error', err);
        });
    }
};
exports.sendFCM = sendFCM;
