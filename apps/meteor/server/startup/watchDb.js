"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastDocDelayed = isLastDocDelayed;
const core_services_1 = require("@rocket.chat/core-services");
const logger_1 = require("@rocket.chat/logger");
const mongo_1 = require("meteor/mongo");
const metrics_1 = require("../../app/metrics/server/lib/metrics");
const DatabaseWatcher_1 = require("../database/DatabaseWatcher");
const utils_1 = require("../database/utils");
const system_1 = require("../lib/logger/system");
const watchers_module_1 = require("../modules/watchers/watchers.module");
const { mongo } = mongo_1.MongoInternals.defaultRemoteCollectionDriver();
const watcher = new DatabaseWatcher_1.DatabaseWatcher({ db: utils_1.db, _oplogHandle: mongo._oplogHandle, metrics: metrics_1.metrics, logger: logger_1.Logger });
(0, watchers_module_1.initWatchers)(watcher, core_services_1.api.broadcastLocal.bind(core_services_1.api));
watcher.watch().catch((err) => {
    system_1.SystemLogger.fatal(err, 'Fatal error occurred when watching database');
    process.exit(1);
});
setInterval(function _checkDatabaseWatcher() {
    if (watcher.isLastDocDelayed()) {
        system_1.SystemLogger.error('No real time data received recently');
    }
}, 20000);
function isLastDocDelayed() {
    return watcher.isLastDocDelayed();
}
