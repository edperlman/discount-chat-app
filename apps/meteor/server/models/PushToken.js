"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const PushToken_1 = require("./raw/PushToken");
(0, models_1.registerModel)('IPushTokenModel', new PushToken_1.PushTokenRaw(utils_1.db));
