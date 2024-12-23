"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const ServiceLevelAgreements_1 = require("./raw/ServiceLevelAgreements");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('IOmnichannelServiceLevelAgreementsModel', new ServiceLevelAgreements_1.ServiceLevelAgreements(utils_1.db));
