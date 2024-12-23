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
const logger_1 = require("@rocket.chat/logger");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../../api/server");
const server_2 = require("../../../../settings/server");
const logger = new logger_1.Logger('WebhookTest');
server_1.API.v1.addRoute('livechat/webhook.test', { authRequired: true, permissionsRequired: ['view-livechat-webhooks'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const sampleData = {
                type: 'LivechatSession',
                _id: 'fasd6f5a4sd6f8a4sdf',
                label: 'title',
                topic: 'asiodojf',
                createdAt: new Date(),
                lastMessageAt: new Date(),
                tags: ['tag1', 'tag2', 'tag3'],
                customFields: {
                    productId: '123456',
                },
                visitor: {
                    _id: '',
                    name: 'visitor name',
                    username: 'visitor-username',
                    department: 'department',
                    email: 'email@address.com',
                    phone: '192873192873',
                    ip: '123.456.7.89',
                    browser: 'Chrome',
                    os: 'Linux',
                    customFields: {
                        customerId: '123456',
                    },
                },
                agent: {
                    _id: 'asdf89as6df8',
                    username: 'agent.username',
                    name: 'Agent Name',
                    email: 'agent@email.com',
                },
                messages: [
                    {
                        username: 'visitor-username',
                        msg: 'message content',
                        ts: new Date(),
                    },
                    {
                        username: 'agent.username',
                        agentId: 'asdf89as6df8',
                        msg: 'message content from agent',
                        ts: new Date(),
                    },
                ],
            };
            const options = {
                method: 'POST',
                headers: {
                    'X-RocketChat-Livechat-Token': server_2.settings.get('Livechat_secret_token'),
                    'Accept': 'application/json',
                },
                body: sampleData,
            };
            const webhookUrl = server_2.settings.get('Livechat_webhookUrl');
            if (!webhookUrl) {
                return server_1.API.v1.failure('Webhook_URL_not_set');
            }
            try {
                logger.debug(`Testing webhook ${webhookUrl}`);
                const request = yield (0, server_fetch_1.serverFetch)(webhookUrl, options);
                const response = yield request.text();
                logger.debug({ response });
                if (request.status === 200) {
                    return server_1.API.v1.success();
                }
                throw new Error('Invalid status code');
            }
            catch (error) {
                logger.error(`Error testing webhook: ${error}`);
                throw new Error('error-invalid-webhook-response');
            }
        });
    },
});
