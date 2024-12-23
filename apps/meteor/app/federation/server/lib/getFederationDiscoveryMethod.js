"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFederationDiscoveryMethod = void 0;
const server_1 = require("../../../settings/server");
const getFederationDiscoveryMethod = () => server_1.settings.get('FEDERATION_Discovery_Method');
exports.getFederationDiscoveryMethod = getFederationDiscoveryMethod;
