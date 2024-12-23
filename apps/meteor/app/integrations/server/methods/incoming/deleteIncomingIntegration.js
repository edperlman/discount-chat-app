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
exports.deleteIncomingIntegration = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const deleteIncomingIntegration = (integrationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let integration;
    if (userId && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-incoming-integrations'))) {
        integration = models_1.Integrations.findOneById(integrationId);
    }
    else if (userId && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-incoming-integrations'))) {
        integration = models_1.Integrations.findOne({
            '_id': integrationId,
            '_createdBy._id': userId,
        });
    }
    else {
        throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
            method: 'deleteIncomingIntegration',
        });
    }
    if (!(yield integration)) {
        throw new meteor_1.Meteor.Error('error-invalid-integration', 'Invalid integration', {
            method: 'deleteIncomingIntegration',
        });
    }
    yield models_1.Integrations.removeById(integrationId);
    void (0, notifyListener_1.notifyOnIntegrationChangedById)(integrationId, 'removed');
});
exports.deleteIncomingIntegration = deleteIncomingIntegration;
meteor_1.Meteor.methods({
    deleteIncomingIntegration(integrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('not_authorized', 'Unauthorized', {
                    method: 'deleteIncomingIntegration',
                });
            }
            yield (0, exports.deleteIncomingIntegration)(integrationId, userId);
            return true;
        });
    },
});
