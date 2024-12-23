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
exports.inboxes = void 0;
exports.configureEmailInboxes = configureEmailInboxes;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const nodemailer_1 = __importDefault(require("nodemailer"));
const EmailInbox_Incoming_1 = require("./EmailInbox_Incoming");
const logger_1 = require("./logger");
const server_1 = require("../../../app/settings/server");
const IMAPInterceptor_1 = require("../../email/IMAPInterceptor");
exports.inboxes = new Map();
function configureEmailInboxes() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const emailInboxesCursor = models_1.EmailInbox.findActive();
        logger_1.logger.info('Clearing old email inbox registrations');
        for (const { imap } of exports.inboxes.values()) {
            imap.stop();
        }
        exports.inboxes.clear();
        try {
            for (var _d = true, emailInboxesCursor_1 = __asyncValues(emailInboxesCursor), emailInboxesCursor_1_1; emailInboxesCursor_1_1 = yield emailInboxesCursor_1.next(), _a = emailInboxesCursor_1_1.done, !_a; _d = true) {
                _c = emailInboxesCursor_1_1.value;
                _d = false;
                const emailInboxRecord = _c;
                try {
                    logger_1.logger.info(`Setting up email interceptor for ${emailInboxRecord.email}`);
                    const imap = new IMAPInterceptor_1.IMAPInterceptor(Object.assign({ password: emailInboxRecord.imap.password, user: emailInboxRecord.imap.username, host: emailInboxRecord.imap.server, port: emailInboxRecord.imap.port }, (emailInboxRecord.imap.secure
                        ? {
                            tls: emailInboxRecord.imap.secure,
                            tlsOptions: {
                                rejectUnauthorized: false,
                            },
                        }
                        : {})), {
                        deleteAfterRead: false,
                        filter: [['UNSEEN'], ['SINCE', emailInboxRecord._createdAt]],
                        rejectBeforeTS: emailInboxRecord._createdAt,
                        markSeen: true,
                        maxRetries: emailInboxRecord.imap.maxRetries,
                    }, emailInboxRecord._id);
                    imap.on('email', (email) => __awaiter(this, void 0, void 0, function* () {
                        if (!email.messageId) {
                            return;
                        }
                        try {
                            yield models_1.EmailMessageHistory.create({ _id: email.messageId, email: emailInboxRecord.email });
                            void (0, EmailInbox_Incoming_1.onEmailReceived)(email, emailInboxRecord.email, emailInboxRecord.department);
                        }
                        catch (e) {
                            // In case the email message history has been received by other instance..
                            logger_1.logger.error(e);
                        }
                    }));
                    yield imap.start();
                    const smtp = nodemailer_1.default.createTransport({
                        host: emailInboxRecord.smtp.server,
                        port: emailInboxRecord.smtp.port,
                        secure: emailInboxRecord.smtp.secure,
                        auth: {
                            user: emailInboxRecord.smtp.username,
                            pass: emailInboxRecord.smtp.password,
                        },
                    });
                    exports.inboxes.set(emailInboxRecord.email, { imap, smtp, config: emailInboxRecord });
                }
                catch (err) {
                    logger_1.logger.error({ msg: `Error setting up email interceptor for ${emailInboxRecord.email}`, err });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = emailInboxesCursor_1.return)) yield _b.call(emailInboxesCursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        logger_1.logger.info(`Configured a total of ${exports.inboxes.size} inboxes`);
    });
}
meteor_1.Meteor.startup(() => {
    server_1.settings.watchOnce('Livechat_Routing_Method', (_) => {
        void configureEmailInboxes();
    });
});
