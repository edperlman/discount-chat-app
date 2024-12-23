"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const FederationServers_1 = require("./raw/FederationServers");
(0, models_1.registerModel)('IFederationServersModel', new FederationServers_1.FederationServersRaw(utils_1.db));
