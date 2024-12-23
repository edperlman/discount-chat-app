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
exports.updateCasServices = updateCasServices;
const service_configuration_1 = require("meteor/service-configuration");
const logger_1 = require("./logger");
const cached_1 = require("../../../app/settings/server/cached");
function updateCasServices() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            // These will pe passed to 'node-cas' as options
            enabled: cached_1.settings.get('CAS_enabled'),
            base_url: cached_1.settings.get('CAS_base_url'),
            login_url: cached_1.settings.get('CAS_login_url'),
            // Rocketchat Visuals
            buttonLabelText: cached_1.settings.get('CAS_button_label_text'),
            buttonLabelColor: cached_1.settings.get('CAS_button_label_color'),
            buttonColor: cached_1.settings.get('CAS_button_color'),
            width: cached_1.settings.get('CAS_popup_width'),
            height: cached_1.settings.get('CAS_popup_height'),
            autoclose: cached_1.settings.get('CAS_autoclose'),
        };
        // Either register or deregister the CAS login service based upon its configuration
        if (data.enabled) {
            logger_1.logger.info('Enabling CAS login service');
            yield service_configuration_1.ServiceConfiguration.configurations.upsertAsync({ service: 'cas' }, { $set: data });
        }
        else {
            logger_1.logger.info('Disabling CAS login service');
            yield service_configuration_1.ServiceConfiguration.configurations.removeAsync({ service: 'cas' });
        }
    });
}
