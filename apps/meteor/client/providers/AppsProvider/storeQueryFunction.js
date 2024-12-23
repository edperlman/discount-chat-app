"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeQueryFunction = storeQueryFunction;
const sortByName = (apps) => apps.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
/**
 * Aggregates result data from marketplace request and instance installed into their appropriate lists
 *
 * Exporting for better testing
 */
function storeQueryFunction(marketplace, instance) {
    if (!marketplace.isFetched && !instance.isFetched) {
        throw new Error('Apps not loaded');
    }
    const marketplaceApps = [];
    const installedApps = [];
    const privateApps = [];
    const clonedData = [...(instance.data || [])];
    sortByName(marketplace.data || []).forEach((app) => {
        const appIndex = clonedData.findIndex(({ id }) => id === app.id);
        const [installedApp] = appIndex > -1 ? clonedData.splice(appIndex, 1) : [];
        const record = Object.assign(Object.assign(Object.assign({}, app), (installedApp && {
            private: installedApp.private,
            installed: true,
            status: installedApp.status,
            version: installedApp.version,
            licenseValidation: installedApp.licenseValidation,
            migrated: installedApp.migrated,
            installedAddon: installedApp.addon,
        })), { bundledIn: app.bundledIn, marketplaceVersion: app.version });
        if (installedApp) {
            if (installedApp.private) {
                privateApps.push(record);
            }
            else {
                installedApps.push(record);
            }
        }
        marketplaceApps.push(record);
    });
    sortByName(clonedData).forEach((app) => {
        if (app.private) {
            privateApps.push(app);
            return;
        }
        installedApps.push(app);
    });
    return [marketplaceApps, installedApps, privateApps];
}
