"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@rocket.chat/logger");
const universal_perf_hooks_1 = require("universal-perf-hooks");
const server_1 = require("../../app/metrics/server");
const callbacks_1 = require("../../lib/callbacks");
callbacks_1.callbacks.setLogger(new logger_1.Logger('Callbacks'));
callbacks_1.callbacks.setMetricsTrackers({
    trackCallback: ({ hook, id }) => {
        const start = universal_perf_hooks_1.performance.now();
        const stopTimer = server_1.metrics.rocketchatCallbacks.startTimer({ hook, callback: id });
        return () => {
            const end = universal_perf_hooks_1.performance.now();
            server_1.StatsTracker.timing('callbacks.time', end - start, [`hook:${hook}`, `callback:${id}`]);
            stopTimer();
        };
    },
    trackHook: ({ hook, length }) => {
        return server_1.metrics.rocketchatHooks.startTimer({
            hook,
            callbacks_length: length,
        });
    },
});
