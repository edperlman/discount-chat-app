"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Imports_1 = require("./raw/Imports");
(0, models_1.registerModel)('IImportsModel', new Imports_1.ImportsModel(utils_1.db));
