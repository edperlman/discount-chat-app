"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outgoingLogger = exports.incomingLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
const logger = new logger_1.Logger('Integrations');
exports.incomingLogger = logger.section('Incoming WebHook');
exports.outgoingLogger = logger.section('Outgoing WebHook');
