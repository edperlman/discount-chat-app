"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.federationServiceLogger = exports.federationBridgeLogger = void 0;
const logger_1 = require("@rocket.chat/logger");
const logger = new logger_1.Logger('Federation_Matrix');
exports.federationBridgeLogger = logger.section('matrix_federation_bridge');
exports.federationServiceLogger = logger.section('matrix_federation_service');
