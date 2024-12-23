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
const underscore_1 = __importDefault(require("underscore"));
const logger_1 = require("../../../../server/features/EmailInbox/logger");
const server_1 = require("../../../settings/server");
const interceptDirectReplyEmails_js_1 = require("../lib/interceptDirectReplyEmails.js");
let client;
const startEmailInterceptor = underscore_1.default.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Email Interceptor...');
    const protocol = server_1.settings.get('Direct_Reply_Protocol');
    const isEnabled = server_1.settings.get('Direct_Reply_Enable') &&
        protocol &&
        server_1.settings.get('Direct_Reply_Host') &&
        server_1.settings.get('Direct_Reply_Port') &&
        server_1.settings.get('Direct_Reply_Username') &&
        server_1.settings.get('Direct_Reply_Password');
    if (client) {
        yield client.stop();
    }
    if (!isEnabled) {
        logger_1.logger.info('Email Interceptor Stopped...');
        return;
    }
    logger_1.logger.info('Starting Email Interceptor...');
    if (protocol === 'IMAP') {
        client = new interceptDirectReplyEmails_js_1.DirectReplyIMAPInterceptor();
        yield client.start();
    }
    if (protocol === 'POP') {
        client = new interceptDirectReplyEmails_js_1.POP3Helper(server_1.settings.get('Direct_Reply_Frequency'));
        client.start();
    }
}), 1000);
server_1.settings.watchByRegex(/^Direct_Reply_.+/, startEmailInterceptor);
void startEmailInterceptor();
