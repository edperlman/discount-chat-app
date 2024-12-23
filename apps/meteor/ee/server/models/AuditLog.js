"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const AuditLog_1 = require("./raw/AuditLog");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('IAuditLogModel', new AuditLog_1.AuditLogRaw(utils_1.db, trash_1.trashCollection));
