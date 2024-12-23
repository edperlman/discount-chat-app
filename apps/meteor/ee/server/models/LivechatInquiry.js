"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatInquiry_1 = require("./raw/LivechatInquiry");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatInquiryModel', new LivechatInquiry_1.LivechatInquiryRawEE(utils_1.db, trash_1.trashCollection));
