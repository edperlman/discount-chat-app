"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const Uploads_1 = require("./raw/Uploads");
(0, models_1.registerModel)('IUploadsModel', new Uploads_1.UploadsRaw(utils_1.db));
