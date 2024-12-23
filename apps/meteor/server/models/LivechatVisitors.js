"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatVisitors_1 = require("./raw/LivechatVisitors");
(0, models_1.registerModel)('ILivechatVisitorsModel', new LivechatVisitors_1.LivechatVisitorsRaw(utils_1.db));
