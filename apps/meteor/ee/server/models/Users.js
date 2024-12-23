"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const Users_1 = require("./raw/Users");
const trash_1 = require("../../../server/database/trash");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('IUsersModel', new Users_1.UsersEE(utils_1.db, trash_1.trashCollection));
