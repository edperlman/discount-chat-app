"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const LivechatDepartmentAgents_1 = require("./raw/LivechatDepartmentAgents");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ILivechatDepartmentAgentsModel', new LivechatDepartmentAgents_1.LivechatDepartmentAgents(utils_1.db, trash_1.trashCollection));
