"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const ExportOperations_1 = require("./raw/ExportOperations");
(0, models_1.registerModel)('IExportOperationsModel', new ExportOperations_1.ExportOperationsRaw(utils_1.db));
