"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const CannedResponse_1 = require("./raw/CannedResponse");
const utils_1 = require("../../../server/database/utils");
(0, models_1.registerModel)('ICannedResponseModel', new CannedResponse_1.CannedResponseRaw(utils_1.db));
