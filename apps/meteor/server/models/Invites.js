"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Invites_1 = require("./raw/Invites");
(0, models_1.registerModel)('IInvitesModel', new Invites_1.InvitesRaw(utils_1.db));
