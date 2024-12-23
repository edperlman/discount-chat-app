"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatCustomField_1 = require("./raw/LivechatCustomField");
(0, models_1.registerModel)('ILivechatCustomFieldModel', new LivechatCustomField_1.LivechatCustomFieldRaw(utils_1.db));
