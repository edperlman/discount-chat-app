"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const ReadReceipts_1 = require("./dummy/ReadReceipts");
(0, models_1.registerModel)('IReadReceiptsModel', new ReadReceipts_1.ReadReceiptsDummy(), false);
