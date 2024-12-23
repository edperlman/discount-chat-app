"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatDepartment_1 = require("./raw/LivechatDepartment");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatDepartmentModel', new LivechatDepartment_1.LivechatDepartmentEE(utils_1.db, trash_1.trashCollection));
