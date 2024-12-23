"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const OAuthAuthCodes_1 = require("./raw/OAuthAuthCodes");
(0, models_1.registerModel)('IOAuthAuthCodesModel', new OAuthAuthCodes_1.OAuthAuthCodesRaw(utils_1.db));
