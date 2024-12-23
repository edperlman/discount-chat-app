"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const settingsStub = {
    get: sinon_1.default.stub(),
};
const twilioStub = {
    validateRequest: sinon_1.default.stub(),
    isRequestFromTwilio: sinon_1.default.stub(),
};
const { Twilio } = proxyquire_1.default.noCallThru().load('../../../../../../server/services/omnichannel-integrations/providers/twilio.ts', {
    '../../../../app/settings/server': { settings: settingsStub },
    '../../../../app/utils/server/restrictions': { fileUploadIsValidContentType: sinon_1.default.stub() },
    '../../../lib/i18n': { i18n: sinon_1.default.stub() },
    '../../../lib/logger/system': { SystemLogger: { error: sinon_1.default.stub() } },
});
/**
 * Get a valid Twilio signature for a request
 *
 * @param {String} authToken your Twilio AuthToken
 * @param {String} url your webhook URL
 * @param {Object} params the included request parameters
 */
function getSignature(authToken, url, params) {
    // get all request parameters
    const data = Object.keys(params)
        // sort them
        .sort()
        // concatenate them to a string
        .reduce((acc, key) => acc + key + params[key], url);
    return (crypto_1.default
        // sign the string with sha1 using your AuthToken
        .createHmac('sha1', authToken)
        .update(Buffer.from(data, 'utf-8'))
        // base64 encode it
        .digest('base64'));
}
describe('Twilio Request Validation', () => {
    beforeEach(() => {
        settingsStub.get.reset();
        twilioStub.validateRequest.reset();
        twilioStub.isRequestFromTwilio.reset();
    });
    it('should not validate a request when process.env.TEST_MODE is true', () => {
        process.env.TEST_MODE = 'true';
        const twilio = new Twilio();
        const request = {
            headers: {
                'x-twilio-signature': 'test',
            },
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.true;
    });
    it('should validate a request when process.env.TEST_MODE is false', () => {
        process.env.TEST_MODE = 'false';
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {
                'x-twilio-signature': getSignature('test', 'https://example.com/api/v1/livechat/sms-incoming/twilio', requestBody),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.true;
    });
    it('should validate a request when query string is present', () => {
        process.env.TEST_MODE = 'false';
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com/');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            originalUrl: '/api/v1/livechat/sms-incoming/twilio?department=1',
            headers: {
                'x-twilio-signature': getSignature('test', 'https://example.com/api/v1/livechat/sms-incoming/twilio?department=1', requestBody),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.true;
    });
    it('should reject a request where signature doesnt match', () => {
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {
                'x-twilio-signature': getSignature('anotherAuthToken', 'https://example.com/api/v1/livechat/sms-incoming/twilio', requestBody),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.false;
    });
    it('should reject a request where signature is missing', () => {
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {},
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.false;
    });
    it('should reject a request where the signature doesnt correspond body', () => {
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {
                'x-twilio-signature': getSignature('test', 'https://example.com/api/v1/livechat/sms-incoming/twilio', {}),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.false;
    });
    it('should return false if URL is not provided', () => {
        process.env.TEST_MODE = 'false';
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('test');
        settingsStub.get.withArgs('Site_Url').returns('');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {
                'x-twilio-signature': getSignature('test', 'https://example.com/api/v1/livechat/sms-incoming/twilio', requestBody),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.false;
    });
    it('should return false if authToken is not provided', () => {
        process.env.TEST_MODE = 'false';
        settingsStub.get.withArgs('SMS_Twilio_authToken').returns('');
        settingsStub.get.withArgs('Site_Url').returns('https://example.com');
        const twilio = new Twilio();
        const requestBody = {
            To: 'test',
            From: 'test',
            Body: 'test',
        };
        const request = {
            headers: {
                'x-twilio-signature': getSignature('test', 'https://example.com/api/v1/livechat/sms-incoming/twilio', requestBody),
            },
            body: requestBody,
        };
        (0, chai_1.expect)(twilio.validateRequest(request)).to.be.false;
    });
});
