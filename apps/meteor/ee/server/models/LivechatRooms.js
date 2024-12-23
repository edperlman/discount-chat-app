"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatRooms_1 = require("./raw/LivechatRooms");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatRoomsModel', new LivechatRooms_1.LivechatRoomsRawEE(utils_1.db, trash_1.trashCollection));
