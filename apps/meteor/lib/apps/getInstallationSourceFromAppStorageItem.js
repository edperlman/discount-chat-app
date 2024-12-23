"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstallationSourceFromAppStorageItem = getInstallationSourceFromAppStorageItem;
/**
 * There have been reports of apps not being correctly migrated from versions prior to 6.0
 *
 * This function is a workaround to get the installation source of an app from the app storage item
 * even if the installationSource property is not set.
 */
function getInstallationSourceFromAppStorageItem(item) {
    return item.installationSource || ('marketplaceInfo' in item ? 'marketplace' : 'private');
}
