"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Messages_1 = require("./raw/Messages");
(0, models_1.registerModel)('IMessagesModel', new Messages_1.MessagesRaw(utils_1.db, trash_1.trashCollection));
