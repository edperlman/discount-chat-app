"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Rooms_1 = require("./raw/Rooms");
(0, models_1.registerModel)('IRoomsModel', new Rooms_1.RoomsRaw(utils_1.db, trash_1.trashCollection));
