"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const EmailInbox_1 = require("./raw/EmailInbox");
(0, models_1.registerModel)('IEmailInboxModel', new EmailInbox_1.EmailInboxRaw(utils_1.db));
