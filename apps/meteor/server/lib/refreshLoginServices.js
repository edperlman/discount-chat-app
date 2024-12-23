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
exports.refreshLoginServices = refreshLoginServices;
const service_configuration_1 = require("meteor/service-configuration");
const updateCasService_1 = require("./cas/updateCasService");
const updateOAuthServices_1 = require("./oauth/updateOAuthServices");
const settings_1 = require("../../app/meteor-accounts-saml/server/lib/settings");
function refreshLoginServices() {
    return __awaiter(this, void 0, void 0, function* () {
        yield service_configuration_1.ServiceConfiguration.configurations.removeAsync({});
        yield Promise.allSettled([(0, updateOAuthServices_1.updateOAuthServices)(), (0, settings_1.loadSamlServiceProviders)(), (0, updateCasService_1.updateCasServices)()]);
    });
}
