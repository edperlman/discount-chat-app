"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const LivechatInquiry_1 = require("./raw/LivechatInquiry");
(0, models_1.registerModel)('ILivechatInquiryModel', new LivechatInquiry_1.LivechatInquiryRaw(utils_1.db, trash_1.trashCollection));
