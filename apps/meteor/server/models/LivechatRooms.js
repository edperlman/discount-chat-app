"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const LivechatRooms_1 = require("./raw/LivechatRooms");
(0, models_1.registerModel)('ILivechatRoomsModel', new LivechatRooms_1.LivechatRoomsRaw(utils_1.db, trash_1.trashCollection));
