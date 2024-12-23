"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-hooks/rules-of-hooks */
const Middleware_1 = require("./Middleware");
const cached_1 = require("./cached");
const getProcessingTimeInMS = (time) => time[0] * 1000 + time[1] / 1e6;
cached_1.settings.watch = (0, Middleware_1.use)(cached_1.settings.watch, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
if (process.env.DEBUG_SETTINGS === 'true') {
    cached_1.settings.watch = (0, Middleware_1.use)(cached_1.settings.watch, function watch(context, next) {
        const [_id, callback, options] = context;
        return next(_id, (...args) => {
            const start = process.hrtime();
            callback(...args);
            const elapsed = process.hrtime(start);
            console.log(`settings.watch: ${_id} ${getProcessingTimeInMS(elapsed)}ms`);
        }, options);
    });
}
cached_1.settings.watchMultiple = (0, Middleware_1.use)(cached_1.settings.watchMultiple, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.watchOnce = (0, Middleware_1.use)(cached_1.settings.watchOnce, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.watchByRegex = (0, Middleware_1.use)(cached_1.settings.watchByRegex, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.change = (0, Middleware_1.use)(cached_1.settings.change, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.changeMultiple = (0, Middleware_1.use)(cached_1.settings.changeMultiple, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.changeOnce = (0, Middleware_1.use)(cached_1.settings.changeOnce, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.changeByRegex = (0, Middleware_1.use)(cached_1.settings.changeByRegex, (context, next) => {
    const [_id, callback, ...args] = context;
    return next(_id, callback, ...args);
});
cached_1.settings.onReady = (0, Middleware_1.use)(cached_1.settings.onReady, (context, next) => {
    const [callback, ...args] = context;
    return next(callback, ...args);
});
