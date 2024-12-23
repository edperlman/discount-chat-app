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
exports.startFederationService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const cached_1 = require("../../../app/settings/server/cached");
const isRunningMs_1 = require("../../../server/lib/isRunningMs");
const service_1 = require("../../../server/services/federation/service");
const license_internalService_1 = require("../../app/license/server/license.internalService");
const omnichannel_internalService_1 = require("../../app/livechat-enterprise/server/services/omnichannel.internalService");
const settings_internalService_1 = require("../../app/settings/server/settings.internalService");
const service_2 = require("../local-services/federation/service");
const service_3 = require("../local-services/instance/service");
const service_4 = require("../local-services/ldap/service");
const service_5 = require("../local-services/message-reads/service");
const service_6 = require("../local-services/voip-freeswitch/service");
// TODO consider registering these services only after a valid license is added
core_services_1.api.registerService(new settings_internalService_1.EnterpriseSettings());
core_services_1.api.registerService(new service_4.LDAPEEService());
core_services_1.api.registerService(new license_internalService_1.LicenseService());
core_services_1.api.registerService(new service_5.MessageReadsService());
core_services_1.api.registerService(new omnichannel_internalService_1.OmnichannelEE());
core_services_1.api.registerService(new service_6.VoipFreeSwitchService((id) => cached_1.settings.get(id)));
// when not running micro services we want to start up the instance intercom
if (!(0, isRunningMs_1.isRunningMs)()) {
    core_services_1.api.registerService(new service_3.InstanceService());
}
const startFederationService = () => __awaiter(void 0, void 0, void 0, function* () {
    let federationService;
    if (!license_1.License.hasValidLicense()) {
        federationService = yield service_1.FederationService.createFederationService();
        core_services_1.api.registerService(federationService);
    }
    void license_1.License.onLicense('federation', () => __awaiter(void 0, void 0, void 0, function* () {
        const federationServiceEE = yield service_2.FederationServiceEE.createFederationService();
        if (federationService) {
            yield core_services_1.api.destroyService(federationService);
        }
        core_services_1.api.registerService(federationServiceEE);
    }));
});
exports.startFederationService = startFederationService;
