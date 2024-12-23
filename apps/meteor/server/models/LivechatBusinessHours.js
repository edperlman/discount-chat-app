"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatBusinessHours_1 = require("./raw/LivechatBusinessHours");
(0, models_1.registerModel)('ILivechatBusinessHoursModel', new LivechatBusinessHours_1.LivechatBusinessHoursRaw(utils_1.db));
