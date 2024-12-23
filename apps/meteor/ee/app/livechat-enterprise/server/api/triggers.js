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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const omnichannel_1 = require("@rocket.chat/rest-typings/src/v1/omnichannel");
const triggers_1 = require("./lib/triggers");
const server_1 = require("../../../../../app/api/server");
const server_2 = require("../../../../../app/settings/server");
server_1.API.v1.addRoute('livechat/triggers/external-service/test', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: omnichannel_1.isLivechatTriggerWebhookTestParams,
    rateLimiterOptions: { numRequestsAllowed: 15, intervalTimeInMS: 60000 },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { webhookUrl, timeout, fallbackMessage, extraData: clientParams } = this.bodyParams;
            const token = server_2.settings.get('Livechat_secret_token');
            if (!token) {
                throw new Error('Livechat secret token is not configured');
            }
            const body = {
                metadata: clientParams,
                visitorToken: '1234567890',
            };
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-RocketChat-Livechat-Token': token,
            };
            const response = yield (0, triggers_1.callTriggerExternalService)({
                url: webhookUrl,
                timeout,
                fallbackMessage,
                body,
                headers,
            });
            if (response.error) {
                return server_1.API.v1.failure(Object.assign({ triggerId: 'test-trigger' }, response));
            }
            return server_1.API.v1.success(Object.assign({ triggerId: 'test-trigger' }, response));
        });
    },
});
server_1.API.v1.addRoute('livechat/triggers/:_id/external-service/call', {
    authRequired: false,
    rateLimiterOptions: {
        numRequestsAllowed: 10,
        intervalTimeInMS: 60000,
    },
    validateParams: rest_typings_1.isLivechatTriggerWebhookCallParams,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: triggerId } = this.urlParams;
            const { token: visitorToken, extraData } = this.bodyParams;
            const trigger = yield models_1.LivechatTrigger.findOneById(triggerId);
            if (!trigger) {
                throw new Error('Invalid trigger');
            }
            if (!(trigger === null || trigger === void 0 ? void 0 : trigger.actions.length) || !(0, core_typings_1.isExternalServiceTrigger)(trigger)) {
                throw new Error('Trigger is not configured to use an external service');
            }
            const { params: { serviceTimeout = 5000, serviceUrl, serviceFallbackMessage = 'trigger-default-fallback-message' } = {} } = trigger.actions[0];
            if (!serviceUrl) {
                throw new Error('Invalid service URL');
            }
            const token = server_2.settings.get('Livechat_secret_token');
            if (!token) {
                throw new Error('Livechat secret token is not configured');
            }
            const body = {
                metadata: extraData,
                visitorToken,
            };
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-RocketChat-Livechat-Token': token,
            };
            const response = yield (0, triggers_1.callTriggerExternalService)({
                url: serviceUrl,
                timeout: serviceTimeout,
                fallbackMessage: serviceFallbackMessage,
                body,
                headers,
            });
            if (response.error) {
                return server_1.API.v1.failure(Object.assign({ triggerId }, response));
            }
            return server_1.API.v1.success(Object.assign({ triggerId }, response));
        });
    },
});
