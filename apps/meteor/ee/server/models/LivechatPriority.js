"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatPriority_1 = require("./raw/LivechatPriority");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatPriorityModel', new LivechatPriority_1.LivechatPriorityRaw(utils_1.db));
