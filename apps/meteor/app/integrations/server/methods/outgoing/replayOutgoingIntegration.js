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
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const triggerHandler_1 = require("../../lib/triggerHandler");
meteor_1.Meteor.methods({
    replayOutgoingIntegration(_a) {
        return __awaiter(this, arguments, void 0, function* ({ integrationId, historyId }) {
            let integration;
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'replayOutgoingIntegration',
                });
            }
            if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-outgoing-integrations')) {
                integration = yield models_1.Integrations.findOneById(integrationId);
            }
            else if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-own-outgoing-integrations')) {
                integration = yield models_1.Integrations.findOne({
                    '_id': integrationId,
                    '_createdBy._id': this.userId,
                });
            }
            if (!integration) {
                throw new meteor_1.Meteor.Error('error-invalid-integration', 'Invalid integration', {
                    method: 'replayOutgoingIntegration',
                });
            }
            const history = yield models_1.IntegrationHistory.findOneByIntegrationIdAndHistoryId(integration._id, historyId);
            if (!history) {
                throw new meteor_1.Meteor.Error('error-invalid-integration-history', 'Invalid Integration History', {
                    method: 'replayOutgoingIntegration',
                });
            }
            yield triggerHandler_1.triggerHandler.replay(integration, history);
            return true;
        });
    },
});
