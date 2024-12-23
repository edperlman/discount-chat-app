"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const ReadReceipts_1 = require("./raw/ReadReceipts");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('IReadReceiptsModel', new ReadReceipts_1.ReadReceiptsRaw(utils_1.db));
