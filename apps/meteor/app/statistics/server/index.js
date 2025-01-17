"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCounter = exports.getStatistics = exports.getLastStatistics = exports.statistics = void 0;
require("./methods/getStatistics");
require("./startup/monitor");
require("./functions/slashCommandsStats");
require("./functions/otrStats");
var statistics_1 = require("./lib/statistics");
Object.defineProperty(exports, "statistics", { enumerable: true, get: function () { return statistics_1.statistics; } });
var getLastStatistics_1 = require("./functions/getLastStatistics");
Object.defineProperty(exports, "getLastStatistics", { enumerable: true, get: function () { return getLastStatistics_1.getLastStatistics; } });
var getStatistics_1 = require("./functions/getStatistics");
Object.defineProperty(exports, "getStatistics", { enumerable: true, get: function () { return getStatistics_1.getStatistics; } });
var updateStatsCounter_1 = require("./functions/updateStatsCounter");
Object.defineProperty(exports, "updateCounter", { enumerable: true, get: function () { return updateStatsCounter_1.updateCounter; } });
