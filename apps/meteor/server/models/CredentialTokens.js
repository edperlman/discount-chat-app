"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const CredentialTokens_1 = require("./raw/CredentialTokens");
(0, models_1.registerModel)('ICredentialTokensModel', new CredentialTokens_1.CredentialTokensRaw(utils_1.db));
