"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const EmailMessageHistory_1 = require("./raw/EmailMessageHistory");
(0, models_1.registerModel)('IEmailMessageHistoryModel', new EmailMessageHistory_1.EmailMessageHistoryRaw(utils_1.db));
