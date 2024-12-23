"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@rocket.chat/logger");
const server_1 = require("../../../app/settings/server");
server_1.settings.watch('Log_Level', (value) => {
    if (value != null) {
        logger_1.logLevel.emit('changed', String(value));
    }
});
server_1.settings.watch('Log_View_Limit', (value) => {
    if (typeof value === 'number') {
        (0, logger_1.setQueueLimit)(value);
    }
});
