"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const SmarshHistory_1 = require("./raw/SmarshHistory");
(0, models_1.registerModel)('ISmarshHistoryModel', new SmarshHistory_1.SmarshHistoryRaw(utils_1.db));
