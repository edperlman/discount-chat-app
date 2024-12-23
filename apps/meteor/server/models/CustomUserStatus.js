"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const CustomUserStatus_1 = require("./raw/CustomUserStatus");
(0, models_1.registerModel)('ICustomUserStatusModel', new CustomUserStatus_1.CustomUserStatusRaw(utils_1.db));
