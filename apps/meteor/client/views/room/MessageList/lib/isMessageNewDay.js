"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessageNewDay = void 0;
const date_fns_1 = require("date-fns");
const isMessageNewDay = (current, previous) => !previous || !(0, date_fns_1.isSameDay)(current.ts, previous.ts);
exports.isMessageNewDay = isMessageNewDay;
