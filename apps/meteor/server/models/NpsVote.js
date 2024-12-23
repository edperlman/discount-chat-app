"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const NpsVote_1 = require("./raw/NpsVote");
(0, models_1.registerModel)('INpsVoteModel', new NpsVote_1.NpsVoteRaw(utils_1.db));
