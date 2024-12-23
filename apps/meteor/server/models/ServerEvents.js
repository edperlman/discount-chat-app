"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const ServerEvents_1 = require("./raw/ServerEvents");
(0, models_1.registerModel)('IServerEventsModel', new ServerEvents_1.ServerEventsRaw(utils_1.db));
