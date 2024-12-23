"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const OAuthApps_1 = require("./raw/OAuthApps");
(0, models_1.registerModel)('IOAuthAppsModel', new OAuthApps_1.OAuthAppsRaw(utils_1.db));
