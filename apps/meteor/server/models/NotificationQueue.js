"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const NotificationQueue_1 = require("./raw/NotificationQueue");
(0, models_1.registerModel)('INotificationQueueModel', new NotificationQueue_1.NotificationQueueRaw(utils_1.db));
