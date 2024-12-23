"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const universal_perf_hooks_1 = require("universal-perf-hooks");
const callbacks_1 = require("../../lib/callbacks");
const getConfig_1 = require("../lib/utils/getConfig");
if ([(0, getConfig_1.getConfig)('debug'), (0, getConfig_1.getConfig)('timed-callbacks')].includes('true')) {
    callbacks_1.callbacks.setMetricsTrackers({
        trackCallback: ({ hook, id, stack }) => {
            const start = universal_perf_hooks_1.performance.now();
            return () => {
                var _a, _b, _c;
                const end = universal_perf_hooks_1.performance.now();
                console.log(String(end - start), hook, id, (_c = (_b = (_a = stack === null || stack === void 0 ? void 0 : stack.split('\n')) === null || _a === void 0 ? void 0 : _a[2]) === null || _b === void 0 ? void 0 : _b.match(/\(.+\)/)) === null || _c === void 0 ? void 0 : _c[0]);
            };
        },
        trackHook: ({ hook }) => {
            const start = universal_perf_hooks_1.performance.now();
            return () => {
                const end = universal_perf_hooks_1.performance.now();
                console.log(`${hook}:`, end - start);
            };
        },
    });
}
