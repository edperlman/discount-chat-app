"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Avatars_1 = require("./raw/Avatars");
(0, models_1.registerModel)('IAvatarsModel', new Avatars_1.AvatarsRaw(utils_1.db));
