"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const OAuthAccessTokens_1 = require("./raw/OAuthAccessTokens");
(0, models_1.registerModel)('IOAuthAccessTokensModel', new OAuthAccessTokens_1.OAuthAccessTokensRaw(utils_1.db));
