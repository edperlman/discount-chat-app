"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const UserDataFiles_1 = require("./raw/UserDataFiles");
(0, models_1.registerModel)('IUserDataFilesModel', new UserDataFiles_1.UserDataFilesRaw(utils_1.db));
