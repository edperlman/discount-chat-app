"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rocketLogger = exports.slackLogger = exports.classLogger = exports.connLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
const logger = new logger_1.Logger('SlackBridge');
exports.connLogger = logger.section('Connection');
exports.classLogger = logger.section('Class');
exports.slackLogger = logger.section('Slack');
exports.rocketLogger = logger.section('Rocket');
