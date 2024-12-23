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
exports.addOutgoingIntegration = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const validateOutgoingIntegration_1 = require("../../lib/validateOutgoingIntegration");
const validateScriptEngine_1 = require("../../lib/validateScriptEngine");
const addOutgoingIntegration = (userId, integration) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, check_1.check)(integration, check_1.Match.ObjectIncluding({
        type: String,
        name: String,
        enabled: Boolean,
        username: String,
        channel: String,
        alias: check_1.Match.Maybe(String),
        emoji: check_1.Match.Maybe(String),
        scriptEnabled: Boolean,
        script: check_1.Match.Maybe(String),
        scriptEngine: check_1.Match.Maybe(String),
        urls: check_1.Match.Maybe([String]),
        event: check_1.Match.Maybe(String),
        triggerWords: check_1.Match.Maybe([String]),
        avatar: check_1.Match.Maybe(String),
        token: check_1.Match.Maybe(String),
        impersonateUser: check_1.Match.Maybe(Boolean),
        retryCount: check_1.Match.Maybe(Number),
        retryDelay: check_1.Match.Maybe(String),
        retryFailedCalls: check_1.Match.Maybe(Boolean),
        runOnEdits: check_1.Match.Maybe(Boolean),
        targetRoom: check_1.Match.Maybe(String),
        triggerWordAnywhere: check_1.Match.Maybe(Boolean),
    }));
    if (!userId ||
        (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-outgoing-integrations')) &&
            !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-outgoing-integrations')))) {
        throw new meteor_1.Meteor.Error('not_authorized');
    }
    if ((_a = integration.script) === null || _a === void 0 ? void 0 : _a.trim()) {
        (0, validateScriptEngine_1.validateScriptEngine)((_b = integration.scriptEngine) !== null && _b !== void 0 ? _b : 'isolated-vm');
    }
    const integrationData = yield (0, validateOutgoingIntegration_1.validateOutgoingIntegration)(integration, userId);
    const { insertedId } = yield models_1.Integrations.insertOne(integrationData);
    if (insertedId) {
        void (0, notifyListener_1.notifyOnIntegrationChanged)(Object.assign(Object.assign({}, integrationData), { _id: insertedId }), 'inserted');
    }
    integrationData._id = insertedId;
    return integrationData;
});
exports.addOutgoingIntegration = addOutgoingIntegration;
meteor_1.Meteor.methods({
    addOutgoingIntegration(integration) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            if (!userId) {
                throw new meteor_1.Meteor.Error('Invalid User');
            }
            return (0, exports.addOutgoingIntegration)(userId, integration);
        });
    },
});
