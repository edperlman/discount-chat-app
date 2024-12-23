"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReactiveQuery = void 0;
const react_query_1 = require("@tanstack/react-query");
const tracker_1 = require("meteor/tracker");
const queueMicrotask_1 = require("../lib/utils/queueMicrotask");
const useReactiveQuery = (queryKey, reactiveQueryFn, options) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useQuery)(Object.assign({ queryKey, queryFn: () => new Promise((resolve, reject) => {
            (0, queueMicrotask_1.queueMicrotask)(() => {
                tracker_1.Tracker.autorun((c) => {
                    const data = reactiveQueryFn();
                    if (c.firstRun) {
                        if (data === undefined) {
                            reject(new Error('Reactive query returned undefined'));
                        }
                        else {
                            resolve(data);
                        }
                        return;
                    }
                    queryClient.invalidateQueries(queryKey, { exact: true });
                    c.stop();
                });
            });
        }), staleTime: Infinity }, options));
};
exports.useReactiveQuery = useReactiveQuery;
