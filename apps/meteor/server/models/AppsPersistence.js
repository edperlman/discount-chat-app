"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const AppsPersistence_1 = require("./raw/AppsPersistence");
(0, models_1.registerModel)('IAppsPersistenceModel', new AppsPersistence_1.AppsPersistenceModel(utils_1.db));
