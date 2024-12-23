"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Users_1 = require("./raw/Users");
(0, models_1.registerModel)('IUsersModel', new Users_1.UsersRaw(utils_1.db));
