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
exports.statistics = void 0;
const console_1 = require("console");
const os_1 = __importDefault(require("os"));
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const mongo_1 = require("meteor/mongo");
const moment_1 = __importDefault(require("moment"));
const getAppsStatistics_1 = require("./getAppsStatistics");
const getEEStatistics_1 = require("./getEEStatistics");
const getImporterStatistics_1 = require("./getImporterStatistics");
const getServicesStatistics_1 = require("./getServicesStatistics");
const readSecondaryPreferred_1 = require("../../../../server/database/readSecondaryPreferred");
const isRunningMs_1 = require("../../../../server/lib/isRunningMs");
const migrations_1 = require("../../../../server/lib/migrations");
const getSettingsStatistics_1 = require("../../../../server/lib/statistics/getSettingsStatistics");
const Statistics_1 = require("../../../../server/services/federation/infrastructure/rocket-chat/adapters/Statistics");
const dashboard_1 = require("../../../federation/server/functions/dashboard");
const server_1 = require("../../../settings/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const getMongoInfo_1 = require("../../../utils/server/functions/getMongoInfo");
const getUserLanguages = (totalUsers) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Users.getUserLanguages();
    const languages = {
        none: totalUsers,
    };
    result.forEach(({ _id, total }) => {
        if (!_id) {
            return;
        }
        languages[_id] = total;
        languages.none -= total;
    });
    return languages;
});
const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
exports.statistics = {
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const readPreference = (0, readSecondaryPreferred_1.readSecondaryPreferred)(db);
        const statistics = {};
        const statsPms = [];
        // Setup Wizard
        const [organizationType, industry, size, country, language, serverType, registerServer] = yield Promise.all([
            server_1.settings.get('Organization_Type'),
            server_1.settings.get('Industry'),
            server_1.settings.get('Size'),
            server_1.settings.get('Country'),
            server_1.settings.get('Language'),
            server_1.settings.get('Server_Type'),
            server_1.settings.get('Register_Server'),
        ]);
        statistics.wizard = {
            organizationType,
            industry,
            size,
            country,
            language,
            serverType,
            registerServer,
        };
        // Version
        const uniqueID = yield models_1.Settings.findOne('uniqueID', { projection: { createdAt: 1 } });
        statistics.uniqueId = server_1.settings.get('uniqueID');
        if (uniqueID) {
            statistics.installedAt = uniqueID.createdAt.toISOString();
        }
        statistics.deploymentFingerprintHash = server_1.settings.get('Deployment_FingerPrint_Hash');
        statistics.deploymentFingerprintVerified = server_1.settings.get('Deployment_FingerPrint_Verified');
        if (rocketchat_info_1.Info) {
            statistics.version = rocketchat_info_1.Info.version;
            statistics.tag = rocketchat_info_1.Info.tag;
            statistics.branch = rocketchat_info_1.Info.branch;
        }
        // User statistics
        statistics.totalUsers = yield models_1.Users.col.countDocuments({});
        statistics.activeUsers = yield models_1.Users.getActiveLocalUserCount();
        statistics.activeGuests = yield models_1.Users.getActiveLocalGuestCount();
        statistics.nonActiveUsers = yield models_1.Users.col.countDocuments({ active: false });
        statistics.appUsers = yield models_1.Users.col.countDocuments({ type: 'app' });
        statistics.onlineUsers = yield models_1.Users.col.countDocuments({ status: core_typings_1.UserStatus.ONLINE });
        statistics.awayUsers = yield models_1.Users.col.countDocuments({ status: core_typings_1.UserStatus.AWAY });
        statistics.busyUsers = yield models_1.Users.col.countDocuments({ status: core_typings_1.UserStatus.BUSY });
        statistics.totalConnectedUsers = statistics.onlineUsers + statistics.awayUsers;
        statistics.offlineUsers = statistics.totalUsers - statistics.onlineUsers - statistics.awayUsers - statistics.busyUsers;
        statsPms.push(getUserLanguages(statistics.totalUsers).then((total) => {
            statistics.userLanguages = total;
        }));
        // Room statistics
        statistics.totalRooms = yield models_1.Rooms.col.countDocuments({});
        statistics.totalChannels = yield models_1.Rooms.countByType('c');
        statistics.totalPrivateGroups = yield models_1.Rooms.countByType('p');
        statistics.totalDirect = yield models_1.Rooms.countByType('d');
        statistics.totalLivechat = yield models_1.Rooms.countByType('l');
        statistics.totalDiscussions = yield models_1.Rooms.countDiscussions();
        statistics.totalThreads = yield models_1.Messages.countThreads();
        // livechat visitors
        statistics.totalLivechatVisitors = yield models_1.LivechatVisitors.estimatedDocumentCount();
        // livechat agents
        statistics.totalLivechatAgents = yield models_1.Users.countAgents();
        statistics.totalLivechatManagers = yield models_1.Users.countDocuments({ roles: 'livechat-manager' });
        // livechat enabled
        statistics.livechatEnabled = server_1.settings.get('Livechat_enabled');
        // Count and types of omnichannel rooms
        statsPms.push(models_1.Rooms.allRoomSourcesCount()
            .toArray()
            .then((roomSources) => {
            statistics.omnichannelSources = roomSources.map(({ _id: { id, alias, type }, count }) => ({
                id,
                alias,
                type,
                count,
            }));
        }));
        // Number of livechat rooms with department
        statsPms.push(models_1.LivechatRooms.countLivechatRoomsWithDepartment().then((count) => {
            statistics.totalLivechatRoomsWithDepartment = count;
        }));
        // Number of departments
        statsPms.push(models_1.LivechatDepartment.estimatedDocumentCount().then((count) => {
            statistics.departments = count;
        }));
        // Number of archived departments
        statsPms.push(models_1.LivechatDepartment.countArchived().then((count) => {
            statistics.archivedDepartments = count;
        }));
        // Workspace allows dpeartment removal
        statistics.isDepartmentRemovalEnabled = server_1.settings.get('Omnichannel_enable_department_removal');
        // Number of triggers
        statsPms.push(models_1.LivechatTrigger.estimatedDocumentCount().then((count) => {
            statistics.totalTriggers = count;
        }));
        // Number of custom fields
        statsPms.push((statistics.totalCustomFields = yield models_1.LivechatCustomField.countDocuments({})));
        // Number of public custom fields
        statsPms.push((statistics.totalLivechatPublicCustomFields = yield models_1.LivechatCustomField.countDocuments({ public: true })));
        // Livechat Automatic forwarding feature enabled
        statistics.livechatAutomaticForwardingUnansweredChats = server_1.settings.get('Livechat_auto_transfer_chat_timeout') !== 0;
        // Type of routing algorithm used on omnichannel
        statistics.routingAlgorithm = server_1.settings.get('Livechat_Routing_Method') || '';
        // is on-hold active
        statistics.onHoldEnabled = server_1.settings.get('Livechat_allow_manual_on_hold');
        // Number of Email Inboxes
        statsPms.push(models_1.EmailInbox.estimatedDocumentCount().then((count) => {
            statistics.emailInboxes = count;
        }));
        statsPms.push(models_1.LivechatBusinessHours.estimatedDocumentCount().then((count) => {
            statistics.BusinessHours = {
                // Number of Business Hours
                total: count,
                // Business Hours strategy
                strategy: server_1.settings.get('Livechat_enable_business_hours') || '',
            };
        }));
        // Type of routing algorithm used on omnichannel
        statistics.routingAlgorithm = server_1.settings.get('Livechat_Routing_Method');
        // is on-hold active
        statistics.onHoldEnabled = server_1.settings.get('Livechat_allow_manual_on_hold');
        // Last-Chatted Agent Preferred (enabled/disabled)
        statistics.lastChattedAgentPreferred = server_1.settings.get('Livechat_last_chatted_agent_routing');
        // Assign new conversations to the contact manager (enabled/disabled)
        statistics.assignNewConversationsToContactManager = server_1.settings.get('Omnichannel_contact_manager_routing');
        // How to handle Visitor Abandonment setting
        statistics.visitorAbandonment = server_1.settings.get('Livechat_abandoned_rooms_action');
        // Amount of chats placed on hold
        statsPms.push(models_1.Messages.countRoomsWithMessageType('omnichannel_placed_chat_on_hold', { readPreference }).then((total) => {
            statistics.chatsOnHold = total;
        }));
        // VoIP Enabled
        statistics.voipEnabled = server_1.settings.get('VoIP_Enabled');
        // Amount of VoIP Calls
        statsPms.push(models_1.Rooms.countByType('v').then((count) => {
            statistics.voipCalls = count;
        }));
        // Amount of VoIP Extensions connected
        statsPms.push(models_1.Users.col.countDocuments({ extension: { $exists: true } }).then((count) => {
            statistics.voipExtensions = count;
        }));
        // Amount of Calls that ended properly
        statsPms.push(models_1.Messages.countByType('voip-call-wrapup', { readPreference }).then((count) => {
            statistics.voipSuccessfulCalls = count;
        }));
        // Amount of Calls that ended with an error
        statsPms.push(models_1.Messages.countByType('voip-call-ended-unexpectedly', { readPreference }).then((count) => {
            statistics.voipErrorCalls = count;
        }));
        // Amount of Calls that were put on hold
        statsPms.push(models_1.Messages.countRoomsWithMessageType('voip-call-on-hold', { readPreference }).then((count) => {
            statistics.voipOnHoldCalls = count;
        }));
        const defaultValue = { contactsCount: 0, conversationsCount: 0, sources: [] };
        const billablePeriod = moment_1.default.utc().format('YYYY-MM');
        statsPms.push(models_1.LivechatRooms.getMACStatisticsForPeriod(billablePeriod).then(([result]) => {
            statistics.omnichannelContactsBySource = result || defaultValue;
        }));
        const monthAgo = moment_1.default.utc().subtract(30, 'days').toDate();
        const today = moment_1.default.utc().toDate();
        statsPms.push(models_1.LivechatRooms.getMACStatisticsBetweenDates(monthAgo, today).then(([result]) => {
            statistics.uniqueContactsOfLastMonth = result || defaultValue;
        }));
        const weekAgo = moment_1.default.utc().subtract(7, 'days').toDate();
        statsPms.push(models_1.LivechatRooms.getMACStatisticsBetweenDates(weekAgo, today).then(([result]) => {
            statistics.uniqueContactsOfLastWeek = result || defaultValue;
        }));
        const yesterday = moment_1.default.utc().subtract(1, 'days').toDate();
        statsPms.push(models_1.LivechatRooms.getMACStatisticsBetweenDates(yesterday, today).then(([result]) => {
            statistics.uniqueContactsOfYesterday = result || defaultValue;
        }));
        // Message statistics
        const channels = yield models_1.Rooms.findByType('c', { projection: { msgs: 1, prid: 1 } }).toArray();
        const totalChannelDiscussionsMessages = yield channels.reduce(function _countChannelDiscussionsMessages(num, room) {
            return num + (room.prid ? room.msgs : 0);
        }, 0);
        statistics.totalChannelMessages =
            (yield channels.reduce(function _countChannelMessages(num, room) {
                return num + room.msgs;
            }, 0)) - totalChannelDiscussionsMessages;
        const privateGroups = yield models_1.Rooms.findByType('p', { projection: { msgs: 1, prid: 1 } }).toArray();
        const totalPrivateGroupsDiscussionsMessages = yield privateGroups.reduce(function _countPrivateGroupsDiscussionsMessages(num, room) {
            return num + (room.prid ? room.msgs : 0);
        }, 0);
        statistics.totalPrivateGroupMessages =
            (yield privateGroups.reduce(function _countPrivateGroupMessages(num, room) {
                return num + room.msgs;
            }, 0)) - totalPrivateGroupsDiscussionsMessages;
        statistics.totalDiscussionsMessages = totalPrivateGroupsDiscussionsMessages + totalChannelDiscussionsMessages;
        statistics.totalDirectMessages = (yield models_1.Rooms.findByType('d', { projection: { msgs: 1 } }).toArray()).reduce(function _countDirectMessages(num, room) {
            return num + room.msgs;
        }, 0);
        statistics.totalLivechatMessages = (yield models_1.Rooms.findByType('l', { projection: { msgs: 1 } }).toArray()).reduce(function _countLivechatMessages(num, room) {
            return num + room.msgs;
        }, 0);
        statistics.totalMessages =
            statistics.totalChannelMessages +
                statistics.totalPrivateGroupMessages +
                statistics.totalDiscussionsMessages +
                statistics.totalDirectMessages +
                statistics.totalLivechatMessages;
        // Federation statistics
        statsPms.push((0, dashboard_1.getStatistics)().then((federationOverviewData) => {
            statistics.federatedServers = federationOverviewData.numberOfServers;
            statistics.federatedUsers = federationOverviewData.numberOfFederatedUsers;
        }));
        statistics.lastLogin = ((_a = (yield models_1.Users.getLastLogin())) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        statistics.lastMessageSentAt = yield models_1.Messages.getLastTimestamp();
        statistics.lastSeenSubscription = ((_b = (yield models_1.Subscriptions.getLastSeen())) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        statistics.os = {
            type: os_1.default.type(),
            platform: os_1.default.platform(),
            arch: os_1.default.arch(),
            release: os_1.default.release(),
            uptime: os_1.default.uptime(),
            loadavg: os_1.default.loadavg(),
            totalmem: os_1.default.totalmem(),
            freemem: os_1.default.freemem(),
            cpus: os_1.default.cpus(),
        };
        statistics.process = {
            nodeVersion: process.version,
            pid: process.pid,
            uptime: process.uptime(),
        };
        statistics.deploy = {
            method: process.env.DEPLOY_METHOD || 'tar',
            platform: process.env.DEPLOY_PLATFORM || 'selfinstall',
        };
        statistics.readReceiptsEnabled = server_1.settings.get('Message_Read_Receipt_Enabled');
        statistics.readReceiptsDetailed = server_1.settings.get('Message_Read_Receipt_Store_Users');
        statistics.enterpriseReady = true;
        statsPms.push(models_1.Uploads.col.estimatedDocumentCount().then((count) => {
            statistics.uploadsTotal = count;
        }));
        statsPms.push(models_1.Uploads.col
            .aggregate([
            {
                $group: { _id: 'total', total: { $sum: '$size' } },
            },
        ], { readPreference })
            .toArray()
            .then((agg) => {
            const [result] = agg;
            statistics.uploadsTotalSize = result ? result.total : 0;
        }));
        statistics.migration = yield (0, migrations_1.getControl)();
        statsPms.push(models_1.InstanceStatus.col.countDocuments({ _updatedAt: { $gt: new Date(Date.now() - process.uptime() * 1000 - 2000) } }).then((count) => {
            statistics.instanceCount = count;
        }));
        const { oplogEnabled, mongoVersion, mongoStorageEngine } = yield (0, getMongoInfo_1.getMongoInfo)();
        statistics.msEnabled = (0, isRunningMs_1.isRunningMs)();
        statistics.oplogEnabled = oplogEnabled;
        statistics.mongoVersion = mongoVersion;
        statistics.mongoStorageEngine = mongoStorageEngine || '';
        statsPms.push(models_1.Sessions.getUniqueUsersOfYesterday().then((result) => {
            statistics.uniqueUsersOfYesterday = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueUsersOfLastWeek().then((result) => {
            statistics.uniqueUsersOfLastWeek = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueUsersOfLastMonth().then((result) => {
            statistics.uniqueUsersOfLastMonth = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueDevicesOfYesterday().then((result) => {
            statistics.uniqueDevicesOfYesterday = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueDevicesOfLastWeek().then((result) => {
            statistics.uniqueDevicesOfLastWeek = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueDevicesOfLastMonth().then((result) => {
            statistics.uniqueDevicesOfLastMonth = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueOSOfYesterday().then((result) => {
            statistics.uniqueOSOfYesterday = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueOSOfLastWeek().then((result) => {
            statistics.uniqueOSOfLastWeek = result;
        }));
        statsPms.push(models_1.Sessions.getUniqueOSOfLastMonth().then((result) => {
            statistics.uniqueOSOfLastMonth = result;
        }));
        statistics.apps = yield (0, getAppsStatistics_1.getAppsStatistics)();
        statistics.services = yield (0, getServicesStatistics_1.getServicesStatistics)();
        statistics.importer = (0, getImporterStatistics_1.getImporterStatistics)();
        statistics.videoConf = yield core_services_1.VideoConf.getStatistics();
        // If getSettingsStatistics() returns an error, save as empty object.
        statsPms.push((0, getSettingsStatistics_1.getSettingsStatistics)().then((res) => {
            const settingsStatisticsObject = res || {};
            statistics.settings = settingsStatisticsObject;
        }));
        statsPms.push(models_1.Integrations.find({}, {
            projection: {
                _id: 0,
                type: 1,
                enabled: 1,
                scriptEnabled: 1,
            },
            readPreference,
        })
            .toArray()
            .then((found) => {
            const integrations = found;
            statistics.integrations = {
                totalIntegrations: integrations.length,
                totalIncoming: integrations.filter((integration) => integration.type === 'webhook-incoming').length,
                totalIncomingActive: integrations.filter((integration) => integration.enabled === true && integration.type === 'webhook-incoming').length,
                totalOutgoing: integrations.filter((integration) => integration.type === 'webhook-outgoing').length,
                totalOutgoingActive: integrations.filter((integration) => integration.enabled === true && integration.type === 'webhook-outgoing').length,
                totalWithScriptEnabled: integrations.filter((integration) => integration.scriptEnabled === true).length,
            };
        }));
        statsPms.push(models_1.NotificationQueue.estimatedDocumentCount().then((count) => {
            statistics.pushQueue = count;
        }));
        statsPms.push((0, getEEStatistics_1.getStatistics)().then((result) => {
            statistics.enterprise = result;
        }));
        statsPms.push(core_services_1.Team.getStatistics().then((result) => {
            statistics.teams = result;
        }));
        statsPms.push(core_services_1.Analytics.resetSeatRequestCount());
        // TODO: Is that the best way to do this? maybe we should use a promise.all()
        statistics.dashboardCount = server_1.settings.get('Engagement_Dashboard_Load_Count');
        statistics.messageAuditApply = server_1.settings.get('Message_Auditing_Apply_Count');
        statistics.messageAuditLoad = server_1.settings.get('Message_Auditing_Panel_Load_Count');
        statistics.joinJitsiButton = server_1.settings.get('Jitsi_Click_To_Join_Count');
        statistics.slashCommandsJitsi = server_1.settings.get('Jitsi_Start_SlashCommands_Count');
        statistics.totalOTRRooms = yield models_1.Rooms.countByCreatedOTR({ readPreference });
        statistics.totalOTR = server_1.settings.get('OTR_Count');
        statistics.totalBroadcastRooms = yield models_1.Rooms.countByBroadcast({ readPreference });
        statistics.totalTriggeredEmails = server_1.settings.get('Triggered_Emails_Count');
        statistics.totalRoomsWithStarred = yield models_1.Messages.countRoomsWithStarredMessages({ readPreference });
        statistics.totalRoomsWithPinned = yield models_1.Messages.countRoomsWithPinnedMessages({ readPreference });
        statistics.totalUserTOTP = yield models_1.Users.countActiveUsersTOTPEnable({ readPreference });
        statistics.totalUserEmail2fa = yield models_1.Users.countActiveUsersEmail2faEnable({ readPreference });
        statistics.totalPinned = yield models_1.Messages.countPinned({ readPreference });
        statistics.totalStarred = yield models_1.Messages.countStarred({ readPreference });
        statistics.totalLinkInvitation = yield models_1.Invites.estimatedDocumentCount();
        statistics.totalLinkInvitationUses = yield models_1.Invites.countUses();
        statistics.totalEmailInvitation = server_1.settings.get('Invitation_Email_Count');
        statistics.totalE2ERooms = yield models_1.Rooms.countByE2E({ readPreference });
        statistics.logoChange = Object.keys(server_1.settings.get('Assets_logo') || {}).includes('url');
        statistics.showHomeButton = server_1.settings.get('Layout_Show_Home_Button');
        statistics.totalEncryptedMessages = yield models_1.Messages.countByType('e2e', { readPreference });
        statistics.totalManuallyAddedUsers = server_1.settings.get('Manual_Entry_User_Count');
        statistics.totalSubscriptionRoles = yield models_1.Roles.countByScope('Subscriptions', { readPreference });
        statistics.totalUserRoles = yield models_1.Roles.countByScope('Users', { readPreference });
        statistics.totalCustomRoles = yield models_1.Roles.countCustomRoles({ readPreference });
        statistics.totalWebRTCCalls = server_1.settings.get('WebRTC_Calls_Count');
        statistics.uncaughtExceptionsCount = server_1.settings.get('Uncaught_Exceptions_Count');
        const defaultGateway = (_c = (yield models_1.Settings.findOneById('Push_gateway', { projection: { packageValue: 1 } }))) === null || _c === void 0 ? void 0 : _c.packageValue;
        // Push notification stats
        // one bit for each of the following:
        const pushEnabled = server_1.settings.get('Push_enable') ? 1 : 0;
        const pushGatewayEnabled = server_1.settings.get('Push_enable_gateway') ? 2 : 0;
        const pushGatewayChanged = server_1.settings.get('Push_gateway') !== defaultGateway ? 4 : 0;
        statistics.push = pushEnabled | pushGatewayEnabled | pushGatewayChanged;
        statistics.pushSecured = server_1.settings.get('Push_request_content_from_server');
        const defaultHomeTitle = (_d = (yield models_1.Settings.findOneById('Layout_Home_Title'))) === null || _d === void 0 ? void 0 : _d.packageValue;
        statistics.homeTitleChanged = server_1.settings.get('Layout_Home_Title') !== defaultHomeTitle;
        const defaultHomeBody = (_e = (yield models_1.Settings.findOneById('Layout_Home_Body'))) === null || _e === void 0 ? void 0 : _e.packageValue;
        statistics.homeBodyChanged = server_1.settings.get('Layout_Home_Body') !== defaultHomeBody;
        const defaultCustomCSS = (_f = (yield models_1.Settings.findOneById('theme-custom-css'))) === null || _f === void 0 ? void 0 : _f.packageValue;
        statistics.customCSSChanged = server_1.settings.get('theme-custom-css') !== defaultCustomCSS;
        const defaultOnLogoutCustomScript = (_g = (yield models_1.Settings.findOneById('Custom_Script_On_Logout'))) === null || _g === void 0 ? void 0 : _g.packageValue;
        statistics.onLogoutCustomScriptChanged = server_1.settings.get('Custom_Script_On_Logout') !== defaultOnLogoutCustomScript;
        const defaultLoggedOutCustomScript = (_h = (yield models_1.Settings.findOneById('Custom_Script_Logged_Out'))) === null || _h === void 0 ? void 0 : _h.packageValue;
        statistics.loggedOutCustomScriptChanged = server_1.settings.get('Custom_Script_Logged_Out') !== defaultLoggedOutCustomScript;
        const defaultLoggedInCustomScript = (_j = (yield models_1.Settings.findOneById('Custom_Script_Logged_In'))) === null || _j === void 0 ? void 0 : _j.packageValue;
        statistics.loggedInCustomScriptChanged = server_1.settings.get('Custom_Script_Logged_In') !== defaultLoggedInCustomScript;
        try {
            statistics.dailyPeakConnections = yield core_services_1.Presence.getPeakConnections(true);
        }
        catch (_k) {
            statistics.dailyPeakConnections = 0;
        }
        const peak = yield models_1.Statistics.findMonthlyPeakConnections();
        statistics.maxMonthlyPeakConnections = Math.max(statistics.dailyPeakConnections, (peak === null || peak === void 0 ? void 0 : peak.dailyPeakConnections) || 0);
        statistics.matrixFederation = yield (0, Statistics_1.getMatrixFederationStatistics)();
        // Omnichannel call stats
        statistics.webRTCEnabled = server_1.settings.get('WebRTC_Enabled');
        statistics.webRTCEnabledForOmnichannel = server_1.settings.get('Omnichannel_call_provider') === 'WebRTC';
        statistics.omnichannelWebRTCCalls = yield models_1.Rooms.findCountOfRoomsWithActiveCalls();
        yield Promise.all(statsPms).catch(console_1.log);
        return statistics;
    }),
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const rcStatistics = yield exports.statistics.get();
            rcStatistics.createdAt = new Date();
            const { insertedId } = yield models_1.Statistics.insertOne(rcStatistics);
            rcStatistics._id = insertedId;
            return rcStatistics;
        });
    },
};
