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
exports.LicenseService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const guestPermissions_1 = require("../../authorization/lib/guestPermissions");
const resetEnterprisePermissions_1 = require("../../authorization/server/resetEnterprisePermissions");
class LicenseService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'license';
        license_1.License.onValidateLicense(() => {
            if (!license_1.License.hasValidLicense()) {
                return;
            }
            void core_services_1.api.broadcast('authorization.guestPermissions', guestPermissions_1.guestPermissions);
            void (0, resetEnterprisePermissions_1.resetEnterprisePermissions)();
        });
        license_1.License.onModule((licenseModule) => {
            void core_services_1.api.broadcast('license.module', licenseModule);
        });
        this.onEvent('license.actions', (preventedActions) => license_1.License.syncShouldPreventActionResults(preventedActions));
        this.onEvent('license.sync', () => license_1.License.sync());
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasValidLicense()) {
                return;
            }
            void core_services_1.api.broadcast('authorization.guestPermissions', guestPermissions_1.guestPermissions);
            yield (0, resetEnterprisePermissions_1.resetEnterprisePermissions)();
        });
    }
    hasModule(feature) {
        return license_1.License.hasModule(feature);
    }
    hasValidLicense() {
        return license_1.License.hasValidLicense();
    }
    getModules() {
        return license_1.License.getModules();
    }
    getGuestPermissions() {
        return guestPermissions_1.guestPermissions;
    }
}
exports.LicenseService = LicenseService;
