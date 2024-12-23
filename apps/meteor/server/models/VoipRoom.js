"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const VoipRoom_1 = require("./raw/VoipRoom");
(0, models_1.registerModel)('IVoipRoomModel', new VoipRoom_1.VoipRoomRaw(utils_1.db, trash_1.trashCollection));
