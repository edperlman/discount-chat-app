"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Roles_1 = require("./raw/Roles");
(0, models_1.registerModel)('IRolesModel', new Roles_1.RolesRaw(utils_1.db, trash_1.trashCollection));
