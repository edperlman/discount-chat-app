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
exports.canEnableApp = exports._canEnableApp = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const getInstallationSourceFromAppStorageItem_1 = require("../../../../lib/apps/getInstallationSourceFromAppStorageItem");
const _canEnableApp = (_a, app_1) => __awaiter(void 0, [_a, app_1], void 0, function* ({ Apps, License }, app) {
    var _b;
    if (!(yield Apps.isInitialized())) {
        throw new Error('apps-engine-not-initialized');
    }
    // Migrated apps were installed before the validation was implemented
    // so they're always allowed to be enabled
    if (app.migrated) {
        return;
    }
    if (app.info.addon && !License.hasModule(app.info.addon)) {
        throw new Error('app-addon-not-valid');
    }
    const source = (0, getInstallationSourceFromAppStorageItem_1.getInstallationSourceFromAppStorageItem)(app);
    switch (source) {
        case 'private':
            if (yield License.shouldPreventAction('privateApps')) {
                throw new Error('license-prevented');
            }
            break;
        default:
            if (yield License.shouldPreventAction('marketplaceApps')) {
                throw new Error('license-prevented');
            }
            if (((_b = app.marketplaceInfo) === null || _b === void 0 ? void 0 : _b.isEnterpriseOnly) && !License.hasValidLicense()) {
                throw new Error('invalid-license');
            }
            break;
    }
});
exports._canEnableApp = _canEnableApp;
const canEnableApp = (app) => __awaiter(void 0, void 0, void 0, function* () { return (0, exports._canEnableApp)({ Apps: core_services_1.Apps, License: license_1.License }, app); });
exports.canEnableApp = canEnableApp;
