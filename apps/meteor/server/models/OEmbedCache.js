"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const OEmbedCache_1 = require("./raw/OEmbedCache");
(0, models_1.registerModel)('IOEmbedCacheModel', new OEmbedCache_1.OEmbedCacheRaw(utils_1.db));
