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
exports.mountIntegrationHistoryQueryBasedOnPermissions = exports.mountIntegrationQueryBasedOnPermissions = void 0;
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const mountIntegrationQueryBasedOnPermissions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new meteor_1.Meteor.Error('You must provide the userId to the "mountIntegrationQueryBasedOnPermissions" function.');
    }
    const canViewAllOutgoingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-outgoing-integrations');
    const canViewAllIncomingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-incoming-integrations');
    const canViewOnlyOwnOutgoingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-outgoing-integrations');
    const canViewOnlyOwnIncomingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-incoming-integrations');
    const query = {};
    if (canViewAllOutgoingIntegrations && canViewAllIncomingIntegrations) {
        return query;
    }
    if (canViewOnlyOwnOutgoingIntegrations && canViewOnlyOwnIncomingIntegrations) {
        return { '_createdBy._id': userId };
    }
    query.$or = [];
    if (canViewAllOutgoingIntegrations) {
        query.$or.push({ type: 'webhook-outgoing' });
    }
    if (canViewAllIncomingIntegrations) {
        query.$or.push({ type: 'webhook-incoming' });
    }
    if (canViewOnlyOwnOutgoingIntegrations) {
        query.$or.push({ '_createdBy._id': userId, 'type': 'webhook-outgoing' });
    }
    if (canViewOnlyOwnIncomingIntegrations) {
        query.$or.push({ '_createdBy._id': userId, 'type': 'webhook-incoming' });
    }
    return query;
});
exports.mountIntegrationQueryBasedOnPermissions = mountIntegrationQueryBasedOnPermissions;
const mountIntegrationHistoryQueryBasedOnPermissions = (userId, integrationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new meteor_1.Meteor.Error('You must provide the userId to the "mountIntegrationHistoryQueryBasedOnPermissions" fucntion.');
    }
    if (!integrationId) {
        throw new meteor_1.Meteor.Error('You must provide the integrationId to the "mountIntegrationHistoryQueryBasedOnPermissions" fucntion.');
    }
    const canViewOnlyOwnOutgoingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-own-outgoing-integrations');
    const canViewAllOutgoingIntegrations = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-outgoing-integrations');
    if (!canViewAllOutgoingIntegrations && canViewOnlyOwnOutgoingIntegrations) {
        return { 'integration._id': integrationId, 'integration._createdBy._id': userId };
    }
    return { 'integration._id': integrationId };
});
exports.mountIntegrationHistoryQueryBasedOnPermissions = mountIntegrationHistoryQueryBasedOnPermissions;
