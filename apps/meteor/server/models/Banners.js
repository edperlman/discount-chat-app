"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Banners_1 = require("./raw/Banners");
(0, models_1.registerModel)('IBannersModel', new Banners_1.BannersRaw(utils_1.db));
