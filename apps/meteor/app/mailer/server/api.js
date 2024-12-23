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
exports.getFooter = exports.getHeader = exports.checkAddressFormatAndThrow = exports.send = exports.sendNoWrap = exports.checkAddressFormat = exports.getTemplateWrapped = exports.getTemplate = exports.inlinecss = exports.wrap = exports.replaceEscaped = exports.replace = exports.translate = exports.replacekey = void 0;
const apps_1 = require("@rocket.chat/apps");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const juice_1 = __importDefault(require("juice"));
const email_1 = require("meteor/email");
const meteor_1 = require("meteor/meteor");
const string_strip_html_1 = __importDefault(require("string-strip-html"));
const underscore_1 = __importDefault(require("underscore"));
const replaceVariables_1 = require("./replaceVariables");
const emailValidator_1 = require("../../../lib/emailValidator");
const stringUtils_1 = require("../../../lib/utils/stringUtils");
const i18n_1 = require("../../../server/lib/i18n");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_1 = require("../../settings/server");
let contentHeader;
let contentFooter;
let body;
// define server language for email translations
// @TODO: change TAPi18n.__ function to use the server language by default
let lng = 'en';
server_1.settings.watch('Language', (value) => {
    lng = value || 'en';
});
const replacekey = (str, key, value = '') => str.replace(new RegExp(`(\\[${key}\\]|__${key}__)`, 'igm'), value);
exports.replacekey = replacekey;
const translate = (str) => (0, replaceVariables_1.replaceVariables)(str, (_match, key) => i18n_1.i18n.t(key, { lng }));
exports.translate = translate;
const replace = (str, data = {}) => {
    var _a;
    if (!str) {
        return '';
    }
    const options = Object.assign(Object.assign({ Site_Name: server_1.settings.get('Site_Name'), Site_URL: server_1.settings.get('Site_Url'), Site_URL_Slash: (_a = server_1.settings.get('Site_Url')) === null || _a === void 0 ? void 0 : _a.replace(/\/?$/, '/') }, (data.name
        ? {
            fname: (0, stringUtils_1.strLeft)(String(data.name), ' '),
            lname: (0, stringUtils_1.strRightBack)(String(data.name), ' '),
        }
        : {})), data);
    return Object.entries(options).reduce((ret, [key, value]) => (0, exports.replacekey)(ret, key, value), (0, exports.translate)(str));
};
exports.replace = replace;
const nonEscapeKeys = ['room_path'];
const replaceEscaped = (str, data = {}) => {
    const siteName = server_1.settings.get('Site_Name');
    const siteUrl = server_1.settings.get('Site_Url');
    return (0, exports.replace)(str, Object.assign({ Site_Name: siteName ? (0, string_helpers_1.escapeHTML)(siteName) : undefined, Site_Url: siteUrl ? (0, string_helpers_1.escapeHTML)(siteUrl) : undefined }, Object.entries(data).reduce((ret, [key, value]) => {
        if (value !== undefined && value !== null) {
            ret[key] = nonEscapeKeys.includes(key) ? String(value) : (0, string_helpers_1.escapeHTML)(String(value));
        }
        return ret;
    }, {})));
};
exports.replaceEscaped = replaceEscaped;
const wrap = (html, data = {}) => {
    if (server_1.settings.get('email_plain_text_only')) {
        return (0, exports.replace)(html, data);
    }
    if (!body) {
        throw new Error('error-email-body-not-initialized');
    }
    return (0, exports.replaceEscaped)(body.replace('{{body}}', html), data);
};
exports.wrap = wrap;
const inlinecss = (html) => {
    const css = server_1.settings.get('email_style');
    return css ? juice_1.default.inlineContent(html, css) : html;
};
exports.inlinecss = inlinecss;
const getTemplate = (template, fn, escape = true) => {
    let html = '';
    server_1.settings.watch(template, (value) => {
        html = value || '';
        fn(escape ? (0, exports.inlinecss)(html) : html);
    });
    server_1.settings.watch('email_style', () => {
        fn(escape ? (0, exports.inlinecss)(html) : html);
    });
};
exports.getTemplate = getTemplate;
const getTemplateWrapped = (template, fn) => {
    let html = '';
    const wrapInlineCSS = underscore_1.default.debounce(() => fn((0, exports.wrap)((0, exports.inlinecss)(html))), 100);
    server_1.settings.watch('Email_Header', () => html && wrapInlineCSS());
    server_1.settings.watch('Email_Footer', () => html && wrapInlineCSS());
    server_1.settings.watch('email_style', () => html && wrapInlineCSS());
    server_1.settings.watch(template, (value) => {
        html = value || '';
        return html && wrapInlineCSS();
    });
};
exports.getTemplateWrapped = getTemplateWrapped;
server_1.settings.watchMultiple(['Email_Header', 'Email_Footer'], () => {
    (0, exports.getTemplate)('Email_Header', (value) => {
        contentHeader = (0, exports.replace)(value || '');
        body = (0, exports.inlinecss)(`${contentHeader} {{body}} ${contentFooter}`);
    }, false);
    (0, exports.getTemplate)('Email_Footer', (value) => {
        contentFooter = (0, exports.replace)(value || '');
        body = (0, exports.inlinecss)(`${contentHeader} {{body}} ${contentFooter}`);
    }, false);
    body = (0, exports.inlinecss)(`${contentHeader} {{body}} ${contentFooter}`);
});
const checkAddressFormat = (adresses) => [].concat(adresses).every((address) => (0, emailValidator_1.validateEmail)(address));
exports.checkAddressFormat = checkAddressFormat;
const sendNoWrap = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, from, replyTo, subject, html, text, headers, }) {
    var _b;
    if (!(0, exports.checkAddressFormat)(to)) {
        throw new meteor_1.Meteor.Error('invalid email');
    }
    if (!text) {
        text = html ? (0, string_strip_html_1.default)(html).result : undefined;
    }
    if (server_1.settings.get('email_plain_text_only')) {
        html = undefined;
    }
    const { value } = yield models_1.Settings.incrementValueById('Triggered_Emails_Count', 1, { returnDocument: 'after' });
    if (value) {
        void (0, notifyListener_1.notifyOnSettingChanged)(value);
    }
    const email = { to, from, replyTo, subject, html, text, headers };
    const eventResult = yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPreEmailSent, { email }));
    setImmediate(() => email_1.Email.sendAsync(eventResult || email).catch((e) => console.error(e)));
});
exports.sendNoWrap = sendNoWrap;
const send = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, from, replyTo, subject, html, text, data, headers, }) {
    return (0, exports.sendNoWrap)({
        to,
        from,
        replyTo,
        subject: (0, exports.replace)(subject, data),
        text: (text && (0, exports.replace)(text, data)) || (html && (0, string_strip_html_1.default)((0, exports.replace)(html, data)).result) || undefined,
        html: html ? (0, exports.wrap)(html, data) : undefined,
        headers,
    });
});
exports.send = send;
const checkAddressFormatAndThrow = (from, func) => {
    if ((0, exports.checkAddressFormat)(from)) {
        return;
    }
    throw new meteor_1.Meteor.Error('error-invalid-from-address', 'Invalid from address', {
        function: func,
    });
};
exports.checkAddressFormatAndThrow = checkAddressFormatAndThrow;
const getHeader = () => contentHeader;
exports.getHeader = getHeader;
const getFooter = () => contentFooter;
exports.getFooter = getFooter;
