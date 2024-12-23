"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const TeamMember_1 = require("./raw/TeamMember");
(0, models_1.registerModel)('ITeamMemberModel', new TeamMember_1.TeamMemberRaw(utils_1.db));
