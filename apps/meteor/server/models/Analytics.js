"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Analytics_1 = require("./raw/Analytics");
(0, models_1.registerModel)('IAnalyticsModel', new Analytics_1.AnalyticsRaw(utils_1.db));
