"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const BannersDismiss_1 = require("./raw/BannersDismiss");
(0, models_1.registerModel)('IBannersDismissModel', new BannersDismiss_1.BannersDismissRaw(utils_1.db));
