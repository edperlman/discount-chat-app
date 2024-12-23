"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Migrations_1 = require("./raw/Migrations");
(0, models_1.registerModel)('IMigrationsModel', new Migrations_1.MigrationsRaw(utils_1.db));
