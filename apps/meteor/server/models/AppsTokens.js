"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const AppsTokens_1 = require("./raw/AppsTokens");
(0, models_1.registerModel)('IAppsTokensModel', new AppsTokens_1.AppsTokens(utils_1.db));
