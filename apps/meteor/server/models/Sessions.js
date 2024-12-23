"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Sessions_1 = require("./raw/Sessions");
(0, models_1.registerModel)('ISessionsModel', new Sessions_1.SessionsRaw(utils_1.db));
