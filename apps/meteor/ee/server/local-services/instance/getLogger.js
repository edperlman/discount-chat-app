"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = getLogger;
const pino_1 = require("pino");
function getLogger({ MOLECULER_LOG_LEVEL: level, NODE_ENV: mode } = {}) {
    if (!level || typeof level !== 'string') {
        return {};
    }
    if (!['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(level)) {
        return {};
    }
    return {
        logger: {
            type: 'Pino',
            options: {
                level,
                pino: {
                    options: Object.assign({ timestamp: pino_1.pino.stdTimeFunctions.isoTime }, (mode !== 'production'
                        ? {
                            transport: {
                                target: 'pino-pretty',
                                options: {
                                    colorize: true,
                                },
                            },
                        }
                        : {})),
                },
            },
        },
    };
}
