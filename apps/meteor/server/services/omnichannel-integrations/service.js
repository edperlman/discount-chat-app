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
exports.OmnichannelIntegrationService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const providers_1 = require("./providers");
class OmnichannelIntegrationService extends core_services_1.ServiceClassInternal {
    registerSmsService(name, service) {
        this.smsServices[name] = service;
    }
    constructor() {
        super();
        this.name = 'omnichannel-integration';
        this.smsServices = {};
        (0, providers_1.registerSmsProviders)(this.registerSmsService.bind(this));
    }
    getSmsService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield core_services_1.Settings.get('SMS_Enabled'))) {
                throw new Error('error-sms-service-disabled');
            }
            if (!this.smsServices[name.toLowerCase()]) {
                throw new Error('error-sms-service-not-configured');
            }
            return new this.smsServices[name.toLowerCase()]();
        });
    }
    isConfiguredSmsService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return name.toLowerCase() === (yield core_services_1.Settings.get('SMS_Service'));
        });
    }
}
exports.OmnichannelIntegrationService = OmnichannelIntegrationService;
