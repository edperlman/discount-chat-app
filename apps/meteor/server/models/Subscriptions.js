"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const trash_1 = require("../database/trash");
const utils_1 = require("../database/utils");
const Subscriptions_1 = require("./raw/Subscriptions");
(0, models_1.registerModel)('ISubscriptionsModel', new Subscriptions_1.SubscriptionsRaw(utils_1.db, trash_1.trashCollection));
