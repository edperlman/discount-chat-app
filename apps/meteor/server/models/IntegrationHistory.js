"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const IntegrationHistory_1 = require("./raw/IntegrationHistory");
(0, models_1.registerModel)('IIntegrationHistoryModel', new IntegrationHistory_1.IntegrationHistoryRaw(utils_1.db));
