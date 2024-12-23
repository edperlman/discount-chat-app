"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Integrations_1 = require("./raw/Integrations");
(0, models_1.registerModel)('IIntegrationsModel', new Integrations_1.IntegrationsRaw(utils_1.db));
