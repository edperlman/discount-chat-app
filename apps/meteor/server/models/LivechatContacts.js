"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LivechatContacts_1 = require("./raw/LivechatContacts");
(0, models_1.registerModel)('ILivechatContactsModel', new LivechatContacts_1.LivechatContactsRaw(utils_1.db));
