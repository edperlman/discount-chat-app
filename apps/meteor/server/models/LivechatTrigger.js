"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatTrigger_1 = require("./raw/LivechatTrigger");
(0, models_1.registerModel)('ILivechatTriggerModel', new LivechatTrigger_1.LivechatTriggerRaw(utils_1.db));
