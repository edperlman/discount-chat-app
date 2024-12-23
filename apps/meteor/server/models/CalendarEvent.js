"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const CalendarEvent_1 = require("./raw/CalendarEvent");
(0, models_1.registerModel)('ICalendarEventModel', new CalendarEvent_1.CalendarEventRaw(utils_1.db));
