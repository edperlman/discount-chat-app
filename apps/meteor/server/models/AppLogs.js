"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const AppLogsModel_1 = require("./raw/AppLogsModel");
(0, models_1.registerModel)('IAppLogsModel', new AppLogsModel_1.AppsLogsModel(utils_1.db));
