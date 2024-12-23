"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const EmojiCustom_1 = require("./raw/EmojiCustom");
(0, models_1.registerModel)('IEmojiCustomModel', new EmojiCustom_1.EmojiCustomRaw(utils_1.db, trash_1.trashCollection));
