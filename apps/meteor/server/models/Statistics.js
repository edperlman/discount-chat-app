"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Statistics_1 = require("./raw/Statistics");
(0, models_1.registerModel)('IStatisticsModel', new Statistics_1.StatisticsRaw(utils_1.db));
