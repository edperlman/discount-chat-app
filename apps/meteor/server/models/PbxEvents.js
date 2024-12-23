"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const PbxEvents_1 = require("./raw/PbxEvents");
(0, models_1.registerModel)('IPbxEventsModel', new PbxEvents_1.PbxEventsRaw(utils_1.db));
