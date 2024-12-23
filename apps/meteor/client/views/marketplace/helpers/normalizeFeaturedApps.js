"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeFeaturedApps = (appOverviewList, appsResultItems) => {
    const featuredAppsIdList = appOverviewList.map((featuredApp) => featuredApp.latest.id);
    return appsResultItems.filter((app) => featuredAppsIdList.includes(app.id));
};
exports.default = normalizeFeaturedApps;
