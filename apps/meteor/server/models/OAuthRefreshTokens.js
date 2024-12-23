"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const OAuthRefreshTokens_1 = require("./raw/OAuthRefreshTokens");
(0, models_1.registerModel)('IOAuthRefreshTokensModel', new OAuthRefreshTokens_1.OAuthRefreshTokensRaw(utils_1.db));
