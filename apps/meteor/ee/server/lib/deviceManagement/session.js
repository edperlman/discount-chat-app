"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.listenSessionLogin = void 0;
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const moment_1 = __importDefault(require("moment"));
const ua_parser_js_1 = require("ua-parser-js");
const Mailer = __importStar(require("../../../../app/mailer/server/api"));
const server_1 = require("../../../../app/settings/server");
const UAParserCustom_1 = require("../../../../app/statistics/server/lib/UAParserCustom");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const getUserPreference_1 = require("../../../../app/utils/server/lib/getUserPreference");
const events_1 = require("../../../../server/services/device-management/events");
let mailTemplates;
meteor_1.Meteor.startup(() => {
    Mailer.getTemplate('Device_Management_Email_Body', (template) => {
        mailTemplates = template;
    });
});
const uaParser = (uaString) => __awaiter(void 0, void 0, void 0, function* () {
    const ua = new ua_parser_js_1.UAParser(uaString);
    return Object.assign(Object.assign(Object.assign({}, ua.getResult()), (uaString && UAParserCustom_1.UAParserMobile.isMobileApp(uaString) && UAParserCustom_1.UAParserMobile.uaObject(uaString))), (uaString && UAParserCustom_1.UAParserDesktop.isDesktopApp(uaString) && UAParserCustom_1.UAParserDesktop.uaObject(uaString)));
});
const listenSessionLogin = () => {
    return events_1.deviceManagementEvents.on('device-login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, connection }) {
        var _b;
        const deviceEnabled = server_1.settings.get('Device_Management_Enable_Login_Emails');
        if (!deviceEnabled) {
            return;
        }
        if (connection.loginToken) {
            return;
        }
        const user = yield models_1.Users.findOneByIdWithEmailAddress(userId, {
            projection: { 'name': 1, 'username': 1, 'emails': 1, 'settings.preferences.receiveLoginDetectionEmail': 1 },
        });
        if (!((_b = user === null || user === void 0 ? void 0 : user.emails) === null || _b === void 0 ? void 0 : _b.length)) {
            return;
        }
        const userReceiveLoginEmailPreference = !server_1.settings.get('Device_Management_Allow_Login_Email_preference') ||
            (yield (0, getUserPreference_1.getUserPreference)(userId, 'receiveLoginDetectionEmail', true));
        if (!userReceiveLoginEmailPreference) {
            return;
        }
        const dateFormat = server_1.settings.get('Message_TimeAndDateFormat');
        const { name, username, emails: [{ address: email }], } = user;
        const { browser, os, device, cpu, app } = yield uaParser(connection.httpHeaders['user-agent']);
        const mailData = {
            name,
            username,
            browserInfo: `${browser.name} ${browser.version}`,
            osInfo: `${os.name}`,
            deviceInfo: `${device.type || (0, i18n_1.t)('Device_Management_Device_Unknown')} ${device.vendor || ''} ${device.model || ''} ${cpu.architecture || ''}`,
            ipInfo: connection.clientAddress,
            userAgent: '',
            date: (0, moment_1.default)().format(String(dateFormat)),
        };
        switch (device.type) {
            case 'mobile':
            case 'tablet':
            case 'smarttv':
                mailData.browserInfo = `${browser.name} ${browser.version}`;
                mailData.osInfo = `${os.name}`;
                mailData.deviceInfo = `${device.type} ${device.vendor || ''} ${device.model || ''} ${cpu.architecture || ''}`;
                break;
            case 'mobile-app':
                mailData.browserInfo = `Rocket.Chat App ${(app === null || app === void 0 ? void 0 : app.bundle) || (app === null || app === void 0 ? void 0 : app.version)}`;
                mailData.osInfo = `${os.name}`;
                mailData.deviceInfo = 'Mobile App';
                break;
            case 'desktop-app':
                mailData.browserInfo = `Rocket.Chat ${(app === null || app === void 0 ? void 0 : app.name) || browser.name} ${(app === null || app === void 0 ? void 0 : app.bundle) || (app === null || app === void 0 ? void 0 : app.version) || browser.version}`;
                mailData.osInfo = `${os.name}`;
                mailData.deviceInfo = `Desktop App ${cpu.architecture || ''}`;
                break;
            default:
                mailData.userAgent = connection.httpHeaders['user-agent'] || '';
                break;
        }
        try {
            yield Mailer.send({
                to: `${name} <${email}>`,
                from: accounts_base_1.Accounts.emailTemplates.from,
                subject: server_1.settings.get('Device_Management_Email_Subject'),
                html: mailTemplates,
                data: mailData,
            });
        }
        catch ({ message }) {
            throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${message}`, {
                method: 'listenSessionLogin',
                message,
            });
        }
    }));
};
exports.listenSessionLogin = listenSessionLogin;
