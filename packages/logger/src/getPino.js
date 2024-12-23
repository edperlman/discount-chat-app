"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPino = getPino;
const pino_1 = require("pino");
// make sure log queue is set up, so pino uses the overwritten process.stdout.write
require("./logQueue");
// add support to multiple params on the log commands, i.e.:
// logger.info('user', await Meteor.userAsync()); // will print: {"level":30,"time":1629814080968,"msg":"user {\"username\": \"foo\"}"}
function logMethod(args, method) {
    if (args.length === 2 && args[0] instanceof Error) {
        return method.apply(this, args);
    }
    if (args.length > 1) {
        args[0] = `${args[0]}${' %j'.repeat(args.length - 1)}`;
    }
    return method.apply(this, args);
}
const infoLevel = process.env.LESS_INFO_LOGS ? 20 : 35;
const mainPino = (0, pino_1.pino)(Object.assign({ hooks: { logMethod }, customLevels: {
        http: infoLevel,
        method: infoLevel,
        subscription: infoLevel,
        startup: 51,
    }, level: 'warn', timestamp: pino_1.pino.stdTimeFunctions.isoTime }, (process.env.NODE_ENV !== 'production'
    ? {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    }
    : {})));
function getPino(name, level = 'warn') {
    return mainPino.child({ name }, { level });
}
