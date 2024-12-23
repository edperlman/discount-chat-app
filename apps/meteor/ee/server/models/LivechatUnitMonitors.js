"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatUnitMonitors_1 = require("./raw/LivechatUnitMonitors");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatUnitMonitorsModel', new LivechatUnitMonitors_1.LivechatUnitMonitorsRaw(utils_1.db));
