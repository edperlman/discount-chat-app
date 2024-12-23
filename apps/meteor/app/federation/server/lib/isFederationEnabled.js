"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFederationEnabled = void 0;
const server_1 = require("../../../settings/server");
const isFederationEnabled = () => server_1.settings.get('FEDERATION_Enabled');
exports.isFederationEnabled = isFederationEnabled;
