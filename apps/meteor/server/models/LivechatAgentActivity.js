"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatAgentActivity_1 = require("./raw/LivechatAgentActivity");
(0, models_1.registerModel)('ILivechatAgentActivityModel', new LivechatAgentActivity_1.LivechatAgentActivityRaw(utils_1.db));
