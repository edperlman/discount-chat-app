"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const settingsMock = sinon_1.default.stub();
const { EmailCheck } = proxyquire_1.default.noCallThru().load('./EmailCheck', {
    '@rocket.chat/models': {
        Users: {},
    },
    'meteor/accounts-base': {
        Accounts: {
            _bcryptRounds: () => '123',
        },
    },
    '../../../../server/lib/i18n': {
        i18n: {
            t: (key) => key,
        },
    },
    '../../../mailer/server/api': {
        send: () => undefined,
    },
    '../../../settings/server': {
        settings: {
            get: settingsMock,
        },
    },
});
const normalUserMock = { services: { email2fa: { enabled: true } }, emails: [{ email: 'abc@gmail.com', verified: true }] };
const normalUserWithUnverifiedEmailMock = {
    services: { email2fa: { enabled: true } },
    emails: [{ email: 'abc@gmail.com', verified: false }],
};
const OAuthUserMock = { services: { google: {} }, emails: [{ email: 'abc@gmail.com', verified: true }] };
(0, mocha_1.describe)('EmailCheck', () => {
    let emailCheck;
    beforeEach(() => {
        settingsMock.reset();
        emailCheck = new EmailCheck();
    });
    (0, mocha_1.it)('should return EmailCheck is enabled for a normal user', () => {
        settingsMock.returns(true);
        const isEmail2FAEnabled = emailCheck.isEnabled(normalUserMock);
        (0, chai_1.expect)(isEmail2FAEnabled).to.be.equal(true);
    });
    (0, mocha_1.it)('should return EmailCheck is not enabled for a normal user with unverified email', () => {
        settingsMock.returns(true);
        const isEmail2FAEnabled = emailCheck.isEnabled(normalUserWithUnverifiedEmailMock);
        (0, chai_1.expect)(isEmail2FAEnabled).to.be.equal(false);
    });
    (0, mocha_1.it)('should return EmailCheck is not enabled for a OAuth user with setting being false', () => {
        settingsMock.returns(true);
        const isEmail2FAEnabled = emailCheck.isEnabled(OAuthUserMock);
        (0, chai_1.expect)(isEmail2FAEnabled).to.be.equal(false);
    });
});
