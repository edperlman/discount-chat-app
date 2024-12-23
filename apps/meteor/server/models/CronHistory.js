"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const CronHistoryModel_1 = require("./raw/CronHistoryModel");
(0, models_1.registerModel)('ICronHistoryModel', new CronHistoryModel_1.CronHistoryRaw(utils_1.db));
