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
exports.IMAPInterceptor = void 0;
const events_1 = require("events");
const stream_1 = require("stream");
const models_1 = require("@rocket.chat/models");
const imap_1 = __importDefault(require("imap"));
const mailparser_1 = require("mailparser");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const logger_1 = require("../features/EmailInbox/logger");
class IMAPInterceptor extends events_1.EventEmitter {
    constructor(imapConfig, options = {
        deleteAfterRead: false,
        filter: ['UNSEEN'],
        markSeen: true,
        maxRetries: 10,
    }, id) {
        super();
        this.options = options;
        this.backoffDurationMS = 3000;
        this.retries = 0;
        this.config = imapConfig;
        this.imap = new imap_1.default(Object.assign(Object.assign({ connTimeout: 10000, keepalive: true }, (imapConfig.tls && { tlsOptions: { servername: imapConfig.host } })), imapConfig));
        this.retries = 0;
        this.inboxId = id;
        this.imap.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.error({ msg: 'IMAP error', err });
        }));
        void this.start();
    }
    openInbox() {
        return new Promise((resolve, reject) => {
            const cb = (err, mailbox) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(mailbox);
                }
            };
            this.imap.openBox('INBOX', false, cb);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // On successfully connected.
            this.imap.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                if (this.isActive()) {
                    logger_1.logger.info(`IMAP connected to ${this.config.user}`);
                    clearTimeout(this.backoff);
                    this.retries = 0;
                    this.backoffDurationMS = 3000;
                    yield this.openInbox();
                    this.imap.on('mail', () => this.getEmails().catch((err) => logger_1.logger.debug('Error on getEmails: ', err.message)));
                }
                else {
                    logger_1.logger.error("Can't connect to IMAP server");
                }
            }));
            this.imap.on('error', () => __awaiter(this, void 0, void 0, function* () {
                this.retries++;
                yield this.reconnect();
            }));
            this.imap.on('close', () => __awaiter(this, void 0, void 0, function* () {
                yield this.reconnect();
            }));
            this.retries += 1;
            return this.imap.connect();
        });
    }
    isActive() {
        var _a;
        return !!(((_a = this.imap) === null || _a === void 0 ? void 0 : _a.state) && this.imap.state !== 'disconnected');
    }
    stop(callback = new Function()) {
        if (this.backoff) {
            clearTimeout(this.backoff);
            this.backoffDurationMS = 3000;
        }
        this.stopWithNoStopBackoff(callback);
    }
    stopWithNoStopBackoff(callback = new Function()) {
        logger_1.logger.debug('IMAP stop called');
        this.imap.removeAllListeners();
        this.imap.once('end', () => {
            logger_1.logger.debug('IMAP stopped');
            callback === null || callback === void 0 ? void 0 : callback();
        });
        this.imap.end();
        this.imap.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.error({ msg: 'IMAP error', err });
        }));
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isActive() && !this.canRetry()) {
                logger_1.logger.info(`Max retries reached for ${this.config.user}`);
                this.stop();
                return this.selfDisable();
            }
            if (this.backoff) {
                clearTimeout(this.backoff);
                this.backoffDurationMS = 3000;
            }
            this.backoff = setTimeout(() => {
                this.stopWithNoStopBackoff();
                void this.start();
            }, (this.backoffDurationMS += this.backoffDurationMS));
        });
    }
    imapSearch() {
        return new Promise((resolve, reject) => {
            const cb = (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            };
            this.imap.search(this.options.filter, cb);
        });
    }
    parseEmails(stream, _info) {
        return new Promise((resolve, reject) => {
            const cb = (err, mail) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(mail);
                }
            };
            (0, mailparser_1.simpleParser)(new stream_1.Readable().wrap(stream), cb);
        });
    }
    imapFetch(emailIds) {
        return new Promise((resolve, reject) => {
            const out = [];
            const messagecb = (msg, seqno) => {
                out.push(seqno);
                const bodycb = (stream, _info) => {
                    (0, mailparser_1.simpleParser)(new stream_1.Readable().wrap(stream), (_err, email) => {
                        if (this.options.rejectBeforeTS && email.date && email.date < this.options.rejectBeforeTS) {
                            logger_1.logger.error({ msg: `Rejecting email on inbox ${this.config.user}`, subject: email.subject });
                            return;
                        }
                        this.emit('email', email);
                        if (this.options.deleteAfterRead) {
                            this.imap.seq.addFlags(email, 'Deleted', (err) => {
                                if (err) {
                                    logger_1.logger.warn(`Mark deleted error: ${err}`);
                                }
                            });
                        }
                    });
                };
                msg.once('body', bodycb);
            };
            const errorcb = (err) => {
                logger_1.logger.warn(`Fetch error: ${err}`);
                reject(err);
            };
            const endcb = () => {
                resolve(out);
            };
            const fetch = this.imap.fetch(emailIds, {
                bodies: ['HEADER', 'TEXT', ''],
                struct: true,
                markSeen: this.options.markSeen,
            });
            fetch.on('message', messagecb);
            fetch.on('error', errorcb);
            fetch.on('end', endcb);
        });
    }
    // Fetch all UNSEEN messages and pass them for further processing
    getEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            const emailIds = yield this.imapSearch();
            yield this.imapFetch(emailIds);
        });
    }
    canRetry() {
        return this.retries < this.options.maxRetries || this.options.maxRetries === -1;
    }
    selfDisable() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Disabling inbox ${this.inboxId}`);
            // Again, if there's 2 inboxes with the same email, this will prevent looping over the already disabled one
            // Active filter is just in case :)
            const { value } = yield models_1.EmailInbox.setDisabledById(this.inboxId);
            if (value) {
                void (0, notifyListener_1.notifyOnEmailInboxChanged)(value, 'updated');
            }
            logger_1.logger.info(`IMAP inbox ${this.inboxId} automatically disabled`);
        });
    }
}
exports.IMAPInterceptor = IMAPInterceptor;
