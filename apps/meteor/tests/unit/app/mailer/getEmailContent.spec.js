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
/* eslint-disable @typescript-eslint/no-empty-function */
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const mocks = {
    '@rocket.chat/string-helpers': {
        escapeHTML: (str) => str,
    },
    'meteor/meteor': {
        Meteor: {
            startup: () => { },
        },
    },
    '../../../../../lib/callbacks': {
        callbacks: {
            run: () => { },
        },
    },
    '../../../../../server/lib/i18n': {
        i18n: {
            t: (trans) => trans,
        },
    },
    '../../../../../server/lib/rooms/roomCoordinator': {
        roomCoordinator: {
            getRoomDirectives: () => ({
                isGroupChat: () => true,
            }),
            getRoomName: () => '',
        },
    },
    '../../../../mailer/server/api': {
        getTemplate: () => { },
        send: () => { },
        replace: () => { },
    },
    '../../../../settings/server': {
        settings: {
            get: () => true,
            watch: () => { },
        },
    },
    '../../../../metrics/server': {
        metrics: {},
    },
    '../../../../utils/server/getURL': {
        getURL: () => { },
    },
};
const message = {
    u: {
        name: 'rocket.cat',
        username: 'rocket.cat',
    },
};
const room = {
    fname: 'room',
    name: 'room',
    t: 'p',
};
(0, mocha_1.describe)('getEmailContent', () => {
    (0, mocha_1.it)('should return preview string for encrypted message', () => __awaiter(void 0, void 0, void 0, function* () {
        const { getEmailContent } = proxyquire_1.default.noCallThru().load('../../../../app/lib/server/functions/notifications/email.js', mocks);
        const result = yield getEmailContent({
            message: Object.assign(Object.assign({}, message), { t: 'e2e' }),
            user: undefined,
            room,
        });
        (0, chai_1.expect)(result).to.be.equal('Encrypted_message_preview_unavailable');
    }));
    (0, mocha_1.it)('should return header for encrypted message if Email_notification_show_message is turned off', () => __awaiter(void 0, void 0, void 0, function* () {
        const { getEmailContent } = proxyquire_1.default.noCallThru().load('../../../../app/lib/server/functions/notifications/email.js', Object.assign(Object.assign({}, mocks), { '../../../../settings/server': {
                settings: {
                    get: () => false,
                    watch: () => { },
                },
            } }));
        const result = yield getEmailContent({
            message: Object.assign(Object.assign({}, message), { t: 'e2e' }),
            user: undefined,
            room,
        });
        (0, chai_1.expect)(result).to.be.equal('User_sent_a_message_on_channel');
    }));
});
