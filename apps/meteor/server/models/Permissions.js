"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Permissions_1 = require("./raw/Permissions");
(0, models_1.registerModel)('IPermissionsModel', new Permissions_1.PermissionsRaw(utils_1.db, trash_1.trashCollection));
