"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.createHistoryAdapter = void 0;
const history_1 = require("history");
const createHistoryAdapter = (memoryHistory) => {
    return {
        listen: (callback) => memoryHistory.listen(({ location }) => callback(location)),
        location: memoryHistory.location,
        push: memoryHistory.push,
        replace: memoryHistory.replace,
    };
};
exports.createHistoryAdapter = createHistoryAdapter;
exports.history = (0, exports.createHistoryAdapter)((0, history_1.createMemoryHistory)());
exports.default = exports.history;
