"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatUnit_1 = require("./raw/LivechatUnit");
const utils_1 = require("../../../server/database/utils");
// @ts-expect-error - Overriding base types :)
(0, models_1.registerModel)('ILivechatUnitModel', new LivechatUnit_1.LivechatUnitRaw(utils_1.db));
