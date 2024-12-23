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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../settings/server");
const constants_1 = require("../constants");
const helpers_1 = require("../functions/helpers");
const callbacks_1 = require("../lib/callbacks");
const dns_1 = require("../lib/dns");
const getFederationDiscoveryMethod_1 = require("../lib/getFederationDiscoveryMethod");
const getFederationDomain_1 = require("../lib/getFederationDomain");
const logger_1 = require("../lib/logger");
const updateSettings = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the key pair
        if ((0, getFederationDiscoveryMethod_1.getFederationDiscoveryMethod)() === 'hub' && !(yield (0, helpers_1.isRegisteringOrEnabled)())) {
            // Register with hub
            try {
                yield (0, helpers_1.updateStatus)(constants_1.STATUS_REGISTERING);
                yield (0, dns_1.registerWithHub)((0, getFederationDomain_1.getFederationDomain)(), server_1.settings.get('Site_Url'), yield models_1.FederationKeys.getPublicKeyString());
                yield (0, helpers_1.updateStatus)(constants_1.STATUS_ENABLED);
            }
            catch (err) {
                // Disable federation
                yield (0, helpers_1.updateEnabled)(false);
                yield (0, helpers_1.updateStatus)(constants_1.STATUS_ERROR_REGISTERING);
            }
            return;
        }
        yield (0, helpers_1.updateStatus)(constants_1.STATUS_ENABLED);
    });
};
// Add settings listeners
server_1.settings.watch('FEDERATION_Enabled', function enableOrDisable(value) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.setupLogger.info(`Federation is ${value ? 'enabled' : 'disabled'}`);
        if (value) {
            yield updateSettings();
            (0, callbacks_1.enableCallbacks)();
        }
        else {
            yield (0, helpers_1.updateStatus)(constants_1.STATUS_DISABLED);
            (0, callbacks_1.disableCallbacks)();
        }
    });
});
server_1.settings.watchMultiple(['FEDERATION_Discovery_Method', 'FEDERATION_Domain'], updateSettings);
