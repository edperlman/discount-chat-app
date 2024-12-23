"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchCollections = getWatchCollections;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const { DBWATCHER_EXCLUDE_COLLECTIONS = '', DBWATCHER_ONLY_COLLECTIONS = '' } = process.env;
const excludeCollections = DBWATCHER_EXCLUDE_COLLECTIONS.split(',')
    .map((collection) => collection.trim())
    .filter(Boolean);
const onlyCollections = DBWATCHER_ONLY_COLLECTIONS.split(',')
    .map((collection) => collection.trim())
    .filter(Boolean);
function getWatchCollections() {
    const collections = [models_1.InstanceStatus.getCollectionName()];
    // add back to the list of collections in case db watchers are enabled
    if (!core_services_1.dbWatchersDisabled) {
        collections.push(models_1.Users.getCollectionName());
        collections.push(models_1.Messages.getCollectionName());
        collections.push(models_1.LivechatInquiry.getCollectionName());
        collections.push(models_1.Roles.getCollectionName());
        collections.push(models_1.Rooms.getCollectionName());
        collections.push(models_1.PbxEvents.getCollectionName());
        collections.push(models_1.Integrations.getCollectionName());
        collections.push(models_1.Permissions.getCollectionName());
        collections.push(models_1.LivechatPriority.getCollectionName());
        collections.push(models_1.LoginServiceConfiguration.getCollectionName());
        collections.push(models_1.EmailInbox.getCollectionName());
        collections.push(models_1.IntegrationHistory.getCollectionName());
        collections.push(models_1.Subscriptions.getCollectionName());
        collections.push(models_1.Settings.getCollectionName());
        collections.push(models_1.LivechatDepartmentAgents.getCollectionName());
    }
    if (onlyCollections.length > 0) {
        return collections.filter((collection) => onlyCollections.includes(collection));
    }
    if (excludeCollections.length > 0) {
        return collections.filter((collection) => !excludeCollections.includes(collection));
    }
    return collections;
}
