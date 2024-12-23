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
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const validateOutgoingIntegration_1 = require("../../lib/validateOutgoingIntegration");
const validateScriptEngine_1 = require("../../lib/validateScriptEngine");
meteor_1.Meteor.methods({
    updateOutgoingIntegration(integrationId, _integration) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'updateOutgoingIntegration',
                });
            }
            const integration = yield (0, validateOutgoingIntegration_1.validateOutgoingIntegration)(_integration, this.userId);
            if (!integration.token || integration.token.trim() === '') {
                throw new meteor_1.Meteor.Error('error-invalid-token', 'Invalid token', {
                    method: 'updateOutgoingIntegration',
                });
            }
            let currentIntegration;
            if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-outgoing-integrations')) {
                currentIntegration = yield models_1.Integrations.findOneById(integrationId);
            }
            else if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-own-outgoing-integrations')) {
                currentIntegration = yield models_1.Integrations.findOne({
                    '_id': integrationId,
                    '_createdBy._id': this.userId,
                });
            }
            else {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'updateOutgoingIntegration',
                });
            }
            if (!currentIntegration) {
                throw new meteor_1.Meteor.Error('invalid_integration', '[methods] updateOutgoingIntegration -> integration not found');
            }
            const oldScriptEngine = currentIntegration.scriptEngine;
            const scriptEngine = (_b = (_a = integration.scriptEngine) !== null && _a !== void 0 ? _a : oldScriptEngine) !== null && _b !== void 0 ? _b : 'isolated-vm';
            if (((_c = integration.script) === null || _c === void 0 ? void 0 : _c.trim()) &&
                (scriptEngine !== oldScriptEngine || ((_d = integration.script) === null || _d === void 0 ? void 0 : _d.trim()) !== ((_e = currentIntegration.script) === null || _e === void 0 ? void 0 : _e.trim()))) {
                (0, tools_1.wrapExceptions)(() => (0, validateScriptEngine_1.validateScriptEngine)(scriptEngine)).catch((e) => {
                    throw new meteor_1.Meteor.Error(e.message);
                });
            }
            const isFrozen = (0, validateScriptEngine_1.isScriptEngineFrozen)(scriptEngine);
            const updatedIntegration = yield models_1.Integrations.findOneAndUpdate({ _id: integrationId }, Object.assign({ $set: Object.assign(Object.assign({ event: integration.event, enabled: integration.enabled, name: integration.name, avatar: integration.avatar, emoji: integration.emoji, alias: integration.alias, channel: typeof integration.channel === 'string' ? [integration.channel] : integration.channel, targetRoom: integration.targetRoom, impersonateUser: integration.impersonateUser, username: integration.username, userId: integration.userId, urls: integration.urls, token: integration.token }, (isFrozen
                    ? {}
                    : Object.assign({ script: integration.script, scriptEnabled: integration.scriptEnabled, scriptEngine }, (integration.scriptCompiled ? { scriptCompiled: integration.scriptCompiled } : { scriptError: integration.scriptError })))), { triggerWords: integration.triggerWords, retryFailedCalls: integration.retryFailedCalls, retryCount: integration.retryCount, retryDelay: integration.retryDelay, triggerWordAnywhere: integration.triggerWordAnywhere, runOnEdits: integration.runOnEdits, _updatedAt: new Date(), _updatedBy: yield models_1.Users.findOne({ _id: this.userId }, { projection: { username: 1 } }) }) }, (isFrozen
                ? {}
                : {
                    $unset: Object.assign({}, (integration.scriptCompiled ? { scriptError: 1 } : { scriptCompiled: 1 })),
                })));
            if (updatedIntegration.value) {
                yield (0, notifyListener_1.notifyOnIntegrationChanged)(updatedIntegration.value);
            }
            return updatedIntegration.value;
        });
    },
});
