"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Team_1 = require("./raw/Team");
(0, models_1.registerModel)('ITeamModel', new Team_1.TeamRaw(utils_1.db));
