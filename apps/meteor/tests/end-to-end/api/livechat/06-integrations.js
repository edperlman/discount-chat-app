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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const rooms_1 = require("../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../data/permissions.helper");
(0, mocha_1.describe)('LIVECHAT - Integrations', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('livechat/integrations.settings', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/integrations.settings')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of settings', (done) => {
            (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin'])
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .get((0, api_data_1.api)('livechat/integrations.settings'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.settings).to.be.an('array');
                const settingIds = res.body.settings.map((setting) => setting._id);
                (0, chai_1.expect)(settingIds).to.include.members([
                    'Livechat_webhookUrl',
                    'Livechat_secret_token',
                    'Livechat_http_timeout',
                    'Livechat_webhook_on_start',
                    'Livechat_webhook_on_close',
                    'Livechat_webhook_on_chat_taken',
                    'Livechat_webhook_on_chat_queued',
                    'Livechat_webhook_on_forward',
                    'Livechat_webhook_on_offline_msg',
                    'Livechat_webhook_on_visitor_message',
                    'Livechat_webhook_on_agent_message',
                ]);
            }))
                .then(done)
                .catch(done);
        });
    });
    (0, mocha_1.describe)('Incoming SMS', () => {
        const visitorTokens = [];
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMS_Enabled', true);
            yield (0, permissions_helper_1.updateSetting)('SMS_Service', '');
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMS_Default_Omnichannel_Department', '');
            yield (0, permissions_helper_1.updateSetting)('SMS_Service', 'twilio');
            return Promise.all(visitorTokens.map((token) => (0, rooms_1.deleteVisitor)(token)));
        }));
        (0, mocha_1.describe)('POST livechat/sms-incoming/:service', () => {
            (0, mocha_1.it)('should throw an error if SMS is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('SMS_Enabled', false);
                yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/sms-incoming/twilio'))
                    .set(api_data_1.credentials)
                    .send({
                    from: '+123456789',
                    body: 'Hello',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400);
            }));
            (0, mocha_1.it)('should return an error when SMS service is not configured', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('SMS_Enabled', true);
                yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/sms-incoming/twilio'))
                    .set(api_data_1.credentials)
                    .send({
                    From: '+123456789',
                    To: '+123456789',
                    Body: 'Hello',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if SMS_Default_Omnichannel_Department does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('SMS_Default_Omnichannel_Department', '123');
                yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/sms-incoming/twilio'))
                    .set(api_data_1.credentials)
                    .send({
                    From: '+123456789',
                    To: '+123456789',
                    Body: 'Hello',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400);
            }));
            (0, mocha_1.it)('should return headers and <Response> as body on success', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('SMS_Default_Omnichannel_Department', '');
                yield (0, permissions_helper_1.updateSetting)('SMS_Service', 'twilio');
                yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/sms-incoming/twilio'))
                    .set(api_data_1.credentials)
                    .send({
                    From: '+123456789',
                    To: '+123456789',
                    Body: 'Hello',
                })
                    .expect('Content-Type', 'text/xml')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res).to.have.property('text', '<Response></Response>');
                });
            }));
        });
    });
    (0, mocha_1.describe)('Livechat - Webhooks', () => {
        const webhookUrl = process.env.WEBHOOK_TEST_URL || 'https://httpbin.org';
        (0, mocha_1.describe)('livechat/webhook.test', () => {
            (0, mocha_1.it)('should fail when user doesnt have view-livechat-webhooks permission', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('view-livechat-webhooks', []);
                const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/webhook.test')).set(api_data_1.credentials).expect(403);
                (0, chai_1.expect)(response.body).to.have.property('success', false);
            }));
            (0, mocha_1.it)('should fail if setting Livechat_webhookUrl is not set', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_webhookUrl', '');
                yield (0, permissions_helper_1.updatePermission)('view-livechat-webhooks', ['admin', 'livechat-manager']);
                const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/webhook.test')).set(api_data_1.credentials).expect(400);
                (0, chai_1.expect)(response.body).to.have.property('success', false);
            }));
            (0, mocha_1.it)('should return true if webhook test went good', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_webhookUrl', `${webhookUrl}/status/200`);
                const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/webhook.test')).set(api_data_1.credentials).expect(200);
                (0, chai_1.expect)(response.body.success).to.be.true;
            }));
            (0, mocha_1.it)('should fail if webhook test went bad', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_webhookUrl', `${webhookUrl}/status/400`);
                yield api_data_1.request.post((0, api_data_1.api)('livechat/webhook.test')).set(api_data_1.credentials).expect(400);
            }));
        });
    });
    (0, mocha_1.describe)('omnichannel/integrations', () => {
        (0, mocha_1.describe)('POST', () => {
            (0, mocha_1.it)('should update the integration settings if the required parameters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/integrations'))
                    .set(api_data_1.credentials)
                    .send({
                    LivechatWebhookUrl: 'http://localhost:8080',
                    LivechatSecretToken: 'asdfasdf',
                    LivechatHttpTimeout: 3000,
                    LivechatWebhookOnStart: false,
                    LivechatWebhookOnClose: false,
                    LivechatWebhookOnChatTaken: false,
                    LivechatWebhookOnChatQueued: false,
                    LivechatWebhookOnForward: false,
                    LivechatWebhookOnOfflineMsg: false,
                    LivechatWebhookOnVisitorMessage: false,
                    LivechatWebhookOnAgentMessage: false,
                })
                    .expect(200);
                (0, chai_1.expect)(response.body).to.have.property('success', true);
            }));
            (0, mocha_1.it)('should fail if a wrong type is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/integrations'))
                    .set(api_data_1.credentials)
                    .send({
                    LivechatWebhookUrl: 8000,
                })
                    .expect(200);
                (0, chai_1.expect)(response.body).to.have.property('success', true);
            }));
            (0, mocha_1.it)('should fail if a wrong setting is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/integrations'))
                    .set(api_data_1.credentials)
                    .send({
                    LivechatWebhook_url: 'http://localhost:8000',
                })
                    .expect(400);
                (0, chai_1.expect)(response.body).to.have.property('success', false);
            }));
        });
    });
});
