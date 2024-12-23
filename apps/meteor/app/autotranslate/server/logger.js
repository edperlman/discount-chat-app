"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
const logger = new logger_1.Logger('AutoTranslate');
exports.msLogger = logger.section('Microsoft');
