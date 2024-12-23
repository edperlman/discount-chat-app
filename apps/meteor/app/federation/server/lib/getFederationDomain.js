"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFederationDomain = void 0;
const server_1 = require("../../../settings/server");
const getFederationDomain = () => server_1.settings.get('FEDERATION_Domain').replace('@', '');
exports.getFederationDomain = getFederationDomain;
