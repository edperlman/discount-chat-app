"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const percentiles = [0.01, 0.1, 0.5, 0.9, 0.95, 0.99, 1];
exports.metrics = {
    deprecations: new prom_client_1.default.Counter({
        name: 'rocketchat_deprecations',
        labelNames: ['type', 'kind', 'name', 'params'],
        help: 'cumulated number of deprecations being used',
    }),
    metricsRequests: new prom_client_1.default.Counter({
        name: 'rocketchat_metrics_requests',
        labelNames: ['notification_type'],
        help: 'cumulated number of calls to the metrics endpoint',
    }),
    metricsSize: new prom_client_1.default.Gauge({
        name: 'rocketchat_metrics_size',
        help: 'size of the metrics response in chars',
    }),
    info: new prom_client_1.default.Gauge({
        name: 'rocketchat_info',
        labelNames: ['version', 'unique_id', 'site_url'],
        help: 'Rocket.Chat info',
    }),
    meteorMethods: new prom_client_1.default.Summary({
        name: 'rocketchat_meteor_methods',
        help: 'summary of meteor methods count and time',
        labelNames: ['method', 'has_connection', 'has_user'],
        percentiles,
    }),
    rocketchatCallbacks: new prom_client_1.default.Summary({
        name: 'rocketchat_callbacks',
        help: 'summary of rocketchat callbacks count and time',
        labelNames: ['hook', 'callback'],
        percentiles,
    }),
    rocketchatHooks: new prom_client_1.default.Summary({
        name: 'rocketchat_hooks',
        help: 'summary of rocketchat hooks count and time',
        labelNames: ['hook', 'callbacks_length'],
        percentiles,
    }),
    rocketchatRestApi: new prom_client_1.default.Summary({
        name: 'rocketchat_rest_api',
        help: 'summary of rocketchat rest api count and time',
        labelNames: ['method', 'entrypoint', 'user_agent', 'status', 'version'],
        percentiles,
    }),
    meteorSubscriptions: new prom_client_1.default.Summary({
        name: 'rocketchat_meteor_subscriptions',
        help: 'summary of meteor subscriptions count and time',
        labelNames: ['subscription'],
        percentiles,
    }),
    messagesSent: new prom_client_1.default.Counter({
        name: 'rocketchat_message_sent',
        help: 'cumulated number of messages sent',
    }),
    notificationsSent: new prom_client_1.default.Counter({
        name: 'rocketchat_notification_sent',
        labelNames: ['notification_type'],
        help: 'cumulated number of notifications sent',
    }),
    messageRoundtripTime: new prom_client_1.default.Summary({
        name: 'rocketchat_messages_roundtrip_time_summary',
        help: 'time spent by a message from save to receive back',
        percentiles,
        maxAgeSeconds: 60,
        ageBuckets: 5,
        // pruneAgedBuckets: true, // Type not added to prom-client on 14.2 https://github.com/siimon/prom-client/pull/558
    }),
    ddpSessions: new prom_client_1.default.Gauge({
        name: 'rocketchat_ddp_sessions_count',
        help: 'number of open ddp sessions',
    }),
    ddpAuthenticatedSessions: new prom_client_1.default.Gauge({
        name: 'rocketchat_ddp_sessions_auth',
        help: 'number of authenticated open ddp sessions',
    }),
    ddpConnectedUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_ddp_connected_users',
        help: 'number of unique connected users',
    }),
    ddpRateLimitExceeded: new prom_client_1.default.Counter({
        name: 'rocketchat_ddp_rate_limit_exceeded',
        labelNames: ['limit_name', 'user_id', 'client_address', 'type', 'name', 'connection_id'],
        help: 'number of times a ddp rate limiter was exceeded',
    }),
    version: new prom_client_1.default.Gauge({
        name: 'rocketchat_version',
        labelNames: ['version'],
        help: 'Rocket.Chat version',
    }),
    migration: new prom_client_1.default.Gauge({ name: 'rocketchat_migration', help: 'migration versoin' }),
    instanceCount: new prom_client_1.default.Gauge({
        name: 'rocketchat_instance_count',
        help: 'instances running',
    }),
    oplogEnabled: new prom_client_1.default.Gauge({
        name: 'rocketchat_oplog_enabled',
        labelNames: ['enabled'],
        help: 'oplog enabled',
    }),
    oplogQueue: new prom_client_1.default.Gauge({
        name: 'rocketchat_oplog_queue',
        labelNames: ['queue'],
        help: 'oplog queue',
    }),
    oplog: new prom_client_1.default.Counter({
        name: 'rocketchat_oplog',
        help: 'summary of oplog operations',
        labelNames: ['collection', 'op'],
    }),
    pushQueue: new prom_client_1.default.Gauge({
        name: 'rocketchat_push_queue',
        labelNames: ['queue'],
        help: 'push queue',
    }),
    // User statistics
    totalUsers: new prom_client_1.default.Gauge({ name: 'rocketchat_users_total', help: 'total of users' }),
    activeUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_users_active',
        help: 'total of active users',
    }),
    nonActiveUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_users_non_active',
        help: 'total of non active users',
    }),
    onlineUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_users_online',
        help: 'total of users online',
    }),
    awayUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_users_away',
        help: 'total of users away',
    }),
    offlineUsers: new prom_client_1.default.Gauge({
        name: 'rocketchat_users_offline',
        help: 'total of users offline',
    }),
    // Room statistics
    totalRooms: new prom_client_1.default.Gauge({ name: 'rocketchat_rooms_total', help: 'total of rooms' }),
    totalChannels: new prom_client_1.default.Gauge({
        name: 'rocketchat_channels_total',
        help: 'total of public rooms/channels',
    }),
    totalPrivateGroups: new prom_client_1.default.Gauge({
        name: 'rocketchat_private_groups_total',
        help: 'total of private rooms',
    }),
    totalDirect: new prom_client_1.default.Gauge({
        name: 'rocketchat_direct_total',
        help: 'total of direct rooms',
    }),
    totalLivechat: new prom_client_1.default.Gauge({
        name: 'rocketchat_livechat_total',
        help: 'total of livechat rooms',
    }),
    // Message statistics
    totalMessages: new prom_client_1.default.Gauge({
        name: 'rocketchat_messages_total',
        help: 'total of messages',
    }),
    totalChannelMessages: new prom_client_1.default.Gauge({
        name: 'rocketchat_channel_messages_total',
        help: 'total of messages in public rooms',
    }),
    totalPrivateGroupMessages: new prom_client_1.default.Gauge({
        name: 'rocketchat_private_group_messages_total',
        help: 'total of messages in private rooms',
    }),
    totalDirectMessages: new prom_client_1.default.Gauge({
        name: 'rocketchat_direct_messages_total',
        help: 'total of messages in direct rooms',
    }),
    totalLivechatMessages: new prom_client_1.default.Gauge({
        name: 'rocketchat_livechat_messages_total',
        help: 'total of messages in livechat rooms',
    }),
    // Apps metrics
    totalAppsInstalled: new prom_client_1.default.Gauge({
        name: 'rocketchat_apps_installed',
        help: 'total apps installed',
    }),
    totalAppsEnabled: new prom_client_1.default.Gauge({
        name: 'rocketchat_apps_enabled',
        help: 'total apps enabled',
    }),
    totalAppsFailed: new prom_client_1.default.Gauge({
        name: 'rocketchat_apps_failed',
        help: 'total apps that failed to load',
    }),
    // Meteor Facts
    meteorFacts: new prom_client_1.default.Gauge({
        name: 'rocketchat_meteor_facts',
        labelNames: ['pkg', 'fact'],
        help: 'internal meteor facts',
    }),
    // Livechat metrics
    totalLivechatVisitors: new prom_client_1.default.Gauge({ name: 'rocketchat_visitors_total', help: 'total of visitors' }),
    totalLivechatAgents: new prom_client_1.default.Gauge({ name: 'rocketchat_agents_total', help: 'total of agents' }),
    totalLivechatWebhooksSuccess: new prom_client_1.default.Counter({
        name: 'rocketchat_livechat_webhooks_success',
        help: 'successful livechat webhooks',
    }),
    totalLivechatWebhooksFailures: new prom_client_1.default.Counter({
        name: 'rocketchat_livechat_webhooks_failures',
        help: 'failed livechat webhooks',
    }),
};
// Metrics
