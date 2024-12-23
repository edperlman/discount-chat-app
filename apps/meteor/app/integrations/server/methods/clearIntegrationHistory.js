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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const Notifications_1 = __importDefault(require("../../../notifications/server/lib/Notifications"));
meteor_1.Meteor.methods({
    clearIntegrationHistory(integrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let integration;
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'clearIntegrationHistory',
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
            else {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'clearIntegrationHistory',
                });
            }
            if (!integration) {
                throw new meteor_1.Meteor.Error('error-invalid-integration', 'Invalid integration', {
                    method: 'clearIntegrationHistory',
                });
            }
            // Don't sending to IntegrationHistory listener since it don't waits for 'removed' events.
            yield models_1.IntegrationHistory.removeByIntegrationId(integrationId);
            Notifications_1.default.streamIntegrationHistory.emit(integrationId, { type: 'removed', id: integrationId });
            return true;
        });
    },
});
