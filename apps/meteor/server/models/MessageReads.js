"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const MessageReads_1 = require("./raw/MessageReads");
(0, models_1.registerModel)('IMessageReadsModel', new MessageReads_1.MessageReadsRaw(utils_1.db));
