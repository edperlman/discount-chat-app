"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const LivechatDepartment_1 = require("./raw/LivechatDepartment");
(0, models_1.registerModel)('ILivechatDepartmentModel', new LivechatDepartment_1.LivechatDepartmentRaw(utils_1.db, trash_1.trashCollection));
