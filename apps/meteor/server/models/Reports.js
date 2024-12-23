"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Reports_1 = require("./raw/Reports");
(0, models_1.registerModel)('IReportsModel', new Reports_1.ReportsRaw(utils_1.db));
