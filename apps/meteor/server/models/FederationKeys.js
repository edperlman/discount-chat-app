"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const FederationKeys_1 = require("./raw/FederationKeys");
(0, models_1.registerModel)('IFederationKeysModel', new FederationKeys_1.FederationKeysRaw(utils_1.db));
