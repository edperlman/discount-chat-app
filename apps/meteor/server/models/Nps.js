"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Nps_1 = require("./raw/Nps");
(0, models_1.registerModel)('INpsModel', new Nps_1.NpsRaw(utils_1.db));
