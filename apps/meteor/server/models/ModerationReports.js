"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const ModerationReports_1 = require("./raw/ModerationReports");
(0, models_1.registerModel)('IModerationReportsModel', () => new ModerationReports_1.ModerationReportsRaw(utils_1.db));
