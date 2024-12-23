"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const UsersSessions_1 = require("./raw/UsersSessions");
(0, models_1.registerModel)('IUsersSessionsModel', new UsersSessions_1.UsersSessionsRaw(utils_1.db));
