"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livechatContactsLogger = exports.livechatLogger = exports.businessHourLogger = exports.callbackLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
exports.callbackLogger = new logger_1.Logger('[Omnichannel] Callback');
exports.businessHourLogger = new logger_1.Logger('Business Hour');
exports.livechatLogger = new logger_1.Logger('Livechat');
exports.livechatContactsLogger = new logger_1.Logger('Livechat Contacts');
