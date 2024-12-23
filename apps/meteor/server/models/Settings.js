"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Settings_1 = require("./raw/Settings");
(0, models_1.registerModel)('ISettingsModel', new Settings_1.SettingsRaw(utils_1.db, trash_1.trashCollection));
