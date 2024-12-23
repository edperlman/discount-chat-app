"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const ImportData_1 = require("./raw/ImportData");
(0, models_1.registerModel)('IImportDataModel', new ImportData_1.ImportDataRaw(utils_1.db));
