"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracing_1 = require("@rocket.chat/tracing");
const utils_1 = require("./database/utils");
(0, tracing_1.startTracing)({ service: 'core', db: utils_1.client });
