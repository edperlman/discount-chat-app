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
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
const apps_1 = require("../apps");
const disableAppsWithAddonsCallback_1 = require("../lib/apps/disableAppsWithAddonsCallback");
meteor_1.Meteor.startup(() => {
    function migratePrivateAppsCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apps_1.Apps.isInitialized)
                return;
            void apps_1.Apps.migratePrivateApps();
            void apps_1.Apps.disableMarketplaceApps();
        });
    }
    license_1.License.onInvalidateLicense(migratePrivateAppsCallback);
    license_1.License.onRemoveLicense(migratePrivateAppsCallback);
    // Disable apps that depend on add-ons (external modules) if they are invalidated
    license_1.License.onModule(disableAppsWithAddonsCallback_1.disableAppsWithAddonsCallback);
});
