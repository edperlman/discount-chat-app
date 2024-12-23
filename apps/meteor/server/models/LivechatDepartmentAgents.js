"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const LivechatDepartmentAgents_1 = require("./raw/LivechatDepartmentAgents");
(0, models_1.registerModel)('ILivechatDepartmentAgentsModel', new LivechatDepartmentAgents_1.LivechatDepartmentAgentsRaw(utils_1.db, trash_1.trashCollection));
