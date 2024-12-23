"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatTag_1 = require("./raw/LivechatTag");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatTagModel', new LivechatTag_1.LivechatTagRaw(utils_1.db));
