"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const models_1 = require("@rocket.chat/models");
const tracing_1 = require("@rocket.chat/tracing");
const connect_1 = __importDefault(require("connect"));
const facts_base_1 = require("meteor/facts-base");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const prom_client_1 = __importDefault(require("prom-client"));
const prometheus_gc_stats_1 = __importDefault(require("prometheus-gc-stats"));
const underscore_1 = __importDefault(require("underscore"));
const metrics_1 = require("./metrics");
const system_1 = require("../../../../server/lib/logger/system");
const migrations_1 = require("../../../../server/lib/migrations");
const server_1 = require("../../../settings/server");
const getAppsStatistics_1 = require("../../../statistics/server/lib/getAppsStatistics");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const { mongo } = mongo_1.MongoInternals.defaultRemoteCollectionDriver();
facts_base_1.Facts.incrementServerFact = function (pkg, fact, increment) {
    metrics_1.metrics.meteorFacts.inc({ pkg, fact }, increment);
};
const setPrometheusData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    metrics_1.metrics.info.set({
        version: rocketchat_info_1.Info.version,
        unique_id: server_1.settings.get('uniqueID'),
        site_url: server_1.settings.get('Site_Url'),
    }, 1);
    const sessions = Array.from(meteor_1.Meteor.server.sessions.values());
    const authenticatedSessions = sessions.filter((s) => s.userId);
    metrics_1.metrics.ddpSessions.set(meteor_1.Meteor.server.sessions.size);
    metrics_1.metrics.ddpAuthenticatedSessions.set(authenticatedSessions.length);
    metrics_1.metrics.ddpConnectedUsers.set(underscore_1.default.unique(authenticatedSessions.map((s) => s.userId)).length);
    // Apps metrics
    const { totalInstalled, totalActive, totalFailed } = yield (0, getAppsStatistics_1.getAppsStatistics)();
    metrics_1.metrics.totalAppsInstalled.set(totalInstalled || 0);
    metrics_1.metrics.totalAppsEnabled.set(totalActive || 0);
    metrics_1.metrics.totalAppsFailed.set(totalFailed || 0);
    const oplogQueue = ((_b = (_a = mongo._oplogHandle) === null || _a === void 0 ? void 0 : _a._entryQueue) === null || _b === void 0 ? void 0 : _b.length) || 0;
    metrics_1.metrics.oplogQueue.set(oplogQueue);
    const statistics = yield models_1.Statistics.findLast();
    if (!statistics) {
        return;
    }
    metrics_1.metrics.version.set({ version: statistics.version }, 1);
    metrics_1.metrics.migration.set((yield (0, migrations_1.getControl)()).version);
    metrics_1.metrics.instanceCount.set(statistics.instanceCount);
    metrics_1.metrics.oplogEnabled.set({ enabled: `${statistics.oplogEnabled}` }, 1);
    // User statistics
    metrics_1.metrics.totalUsers.set(statistics.totalUsers);
    metrics_1.metrics.activeUsers.set(statistics.activeUsers);
    metrics_1.metrics.nonActiveUsers.set(statistics.nonActiveUsers);
    metrics_1.metrics.onlineUsers.set(statistics.onlineUsers);
    metrics_1.metrics.awayUsers.set(statistics.awayUsers);
    metrics_1.metrics.offlineUsers.set(statistics.offlineUsers);
    // Room statistics
    metrics_1.metrics.totalRooms.set(statistics.totalRooms);
    metrics_1.metrics.totalChannels.set(statistics.totalChannels);
    metrics_1.metrics.totalPrivateGroups.set(statistics.totalPrivateGroups);
    metrics_1.metrics.totalDirect.set(statistics.totalDirect);
    metrics_1.metrics.totalLivechat.set(statistics.totalLivechat);
    // Message statistics
    metrics_1.metrics.totalMessages.set(statistics.totalMessages);
    metrics_1.metrics.totalChannelMessages.set(statistics.totalChannelMessages);
    metrics_1.metrics.totalPrivateGroupMessages.set(statistics.totalPrivateGroupMessages);
    metrics_1.metrics.totalDirectMessages.set(statistics.totalDirectMessages);
    metrics_1.metrics.totalLivechatMessages.set(statistics.totalLivechatMessages);
    // Livechat stats
    metrics_1.metrics.totalLivechatVisitors.set(statistics.totalLivechatVisitors);
    metrics_1.metrics.totalLivechatAgents.set(statistics.totalLivechatAgents);
    metrics_1.metrics.pushQueue.set(statistics.pushQueue || 0);
});
const app = (0, connect_1.default)();
// const compression = require('compression');
// app.use(compression());
app.use('/metrics', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    prom_client_1.default.register
        .metrics()
        .then((data) => {
        metrics_1.metrics.metricsRequests.inc();
        metrics_1.metrics.metricsSize.set(data.length);
        res.end(data);
    })
        .catch((err) => {
        system_1.SystemLogger.error({ msg: 'Error while collecting metrics', err });
        res.end();
    });
});
app.use('/', (_req, res) => {
    const html = `<html>
		<head>
			<title>Rocket.Chat Prometheus Exporter</title>
		</head>
		<body>
			<h1>Rocket.Chat Prometheus Exporter</h1>
			<p><a href="/metrics">Metrics</a></p>
		</body>
	</html>`;
    res.write(html);
    res.end();
});
const server = http_1.default.createServer(app);
let timer;
let resetTimer;
let defaultMetricsInitiated = false;
let gcStatsInitiated = false;
const was = {
    enabled: false,
    port: 9458,
    resetInterval: 0,
    collectGC: false,
};
const updatePrometheusConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const is = {
        port: process.env.PROMETHEUS_PORT || server_1.settings.get('Prometheus_Port'),
        enabled: server_1.settings.get('Prometheus_Enabled'),
        resetInterval: server_1.settings.get('Prometheus_Reset_Interval'),
        collectGC: server_1.settings.get('Prometheus_Garbage_Collector'),
    };
    if (Object.values(is).some((s) => s == null)) {
        return;
    }
    if (Object.entries(is).every(([k, v]) => v === was[k])) {
        return;
    }
    if (!is.enabled) {
        if (was.enabled) {
            system_1.SystemLogger.info('Disabling Prometheus');
            server.close();
            clearInterval(timer);
        }
        Object.assign(was, is);
        return;
    }
    system_1.SystemLogger.debug({ msg: 'Configuring Prometheus', is });
    if (!was.enabled) {
        server.listen({
            port: is.port,
            host: process.env.BIND_IP || '0.0.0.0',
        });
        timer = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            void (0, tracing_1.tracerSpan)('setPrometheusData', {
                attributes: {
                    port: is.port,
                    host: process.env.BIND_IP || '0.0.0.0',
                },
            }, () => {
                void setPrometheusData();
            });
        }), 5000);
    }
    clearInterval(resetTimer);
    if (is.resetInterval) {
        resetTimer = setInterval(() => {
            prom_client_1.default.register.getMetricsAsArray().forEach((metric) => {
                // @ts-expect-error Property 'hashMap' does not exist on type 'metric'.
                metric.hashMap = {};
            });
        }, is.resetInterval);
    }
    // Prevent exceptions on calling those methods twice since
    // it's not possible to stop them to be able to restart
    try {
        if (defaultMetricsInitiated === false) {
            defaultMetricsInitiated = true;
            prom_client_1.default.collectDefaultMetrics();
        }
        if (is.collectGC && gcStatsInitiated === false) {
            gcStatsInitiated = true;
            (0, prometheus_gc_stats_1.default)(prom_client_1.default.register)();
        }
    }
    catch (error) {
        system_1.SystemLogger.error(error);
    }
    Object.assign(was, is);
});
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.settings.watchByRegex(/^Prometheus_.+/, updatePrometheusConfig);
}));
