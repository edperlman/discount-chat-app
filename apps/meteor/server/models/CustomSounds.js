"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const CustomSounds_1 = require("./raw/CustomSounds");
(0, models_1.registerModel)('ICustomSoundsModel', new CustomSounds_1.CustomSoundsRaw(utils_1.db));
