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
exports.getAppCount = getAppCount;
const core_services_1 = require("@rocket.chat/core-services");
const getInstallationSourceFromAppStorageItem_1 = require("../../../../../lib/apps/getInstallationSourceFromAppStorageItem");
function getAppCount(source) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield core_services_1.Apps.isInitialized())) {
            return 0;
        }
        const apps = yield core_services_1.Apps.getApps({ enabled: true });
        if (!apps || !Array.isArray(apps)) {
            return 0;
        }
        const storageItems = yield Promise.all(apps.map((app) => core_services_1.Apps.getAppStorageItemById(app.id)));
        const activeAppsFromSameSource = storageItems.filter((item) => item && (0, getInstallationSourceFromAppStorageItem_1.getInstallationSourceFromAppStorageItem)(item) === source);
        return activeAppsFromSameSource.length;
    });
}
