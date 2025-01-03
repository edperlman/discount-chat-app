"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthRefreshTokens = exports.OAuthAccessTokens = exports.OAuthAuthCodes = exports.OAuthApps = exports.NpsVote = exports.Nps = exports.NotificationQueue = exports.Messages = exports.LoginServiceConfiguration = exports.LivechatUnitMonitors = exports.LivechatUnit = exports.LivechatVisitors = exports.LivechatTrigger = exports.LivechatTag = exports.LivechatRooms = exports.LivechatPriority = exports.LivechatInquiry = exports.LivechatDepartment = exports.LivechatDepartmentAgents = exports.LivechatCustomField = exports.LivechatContacts = exports.LivechatBusinessHours = exports.LivechatAgentActivity = exports.Invites = exports.Integrations = exports.IntegrationHistory = exports.InstanceStatus = exports.Imports = exports.ImportData = exports.FederationRoomEvents = exports.FederationKeys = exports.FederationServers = exports.ExportOperations = exports.EmojiCustom = exports.EmailMessageHistory = exports.EmailInbox = exports.CustomUserStatus = exports.CustomSounds = exports.CredentialTokens = exports.CannedResponse = exports.Banners = exports.BannersDismiss = exports.Avatars = exports.Analytics = exports.AppLogs = exports.AppsPersistence = exports.AppsTokens = exports.Apps = exports.UpdaterImpl = exports.registerModel = void 0;
exports.WorkspaceCredentials = exports.ModerationReports = exports.Migrations = exports.CronHistory = exports.AuditLog = exports.OmnichannelServiceLevelAgreements = exports.CalendarEvent = exports.MatrixBridgedUser = exports.MatrixBridgedRoom = exports.WebdavAccounts = exports.VoipRoom = exports.VideoConference = exports.UsersSessions = exports.UserDataFiles = exports.Uploads = exports.Users = exports.Team = exports.TeamMember = exports.Subscriptions = exports.Statistics = exports.SmarshHistory = exports.Settings = exports.Sessions = exports.ServerEvents = exports.Rooms = exports.Roles = exports.Reports = exports.MessageReads = exports.ReadReceipts = exports.Permissions = exports.PushToken = exports.PbxEvents = exports.OEmbedCache = void 0;
exports.getCollectionName = getCollectionName;
const proxify_1 = require("./proxify");
const prefix = 'rocketchat_';
function getCollectionName(name) {
    return `${prefix}${name}`;
}
var proxify_2 = require("./proxify");
Object.defineProperty(exports, "registerModel", { enumerable: true, get: function () { return proxify_2.registerModel; } });
var updater_1 = require("./updater");
Object.defineProperty(exports, "UpdaterImpl", { enumerable: true, get: function () { return updater_1.UpdaterImpl; } });
exports.Apps = (0, proxify_1.proxify)('IAppsModel');
exports.AppsTokens = (0, proxify_1.proxify)('IAppsTokensModel');
exports.AppsPersistence = (0, proxify_1.proxify)('IAppsPersistenceModel');
exports.AppLogs = (0, proxify_1.proxify)('IAppLogsModel');
exports.Analytics = (0, proxify_1.proxify)('IAnalyticsModel');
exports.Avatars = (0, proxify_1.proxify)('IAvatarsModel');
exports.BannersDismiss = (0, proxify_1.proxify)('IBannersDismissModel');
exports.Banners = (0, proxify_1.proxify)('IBannersModel');
exports.CannedResponse = (0, proxify_1.proxify)('ICannedResponseModel');
exports.CredentialTokens = (0, proxify_1.proxify)('ICredentialTokensModel');
exports.CustomSounds = (0, proxify_1.proxify)('ICustomSoundsModel');
exports.CustomUserStatus = (0, proxify_1.proxify)('ICustomUserStatusModel');
exports.EmailInbox = (0, proxify_1.proxify)('IEmailInboxModel');
exports.EmailMessageHistory = (0, proxify_1.proxify)('IEmailMessageHistoryModel');
exports.EmojiCustom = (0, proxify_1.proxify)('IEmojiCustomModel');
exports.ExportOperations = (0, proxify_1.proxify)('IExportOperationsModel');
exports.FederationServers = (0, proxify_1.proxify)('IFederationServersModel');
exports.FederationKeys = (0, proxify_1.proxify)('IFederationKeysModel');
exports.FederationRoomEvents = (0, proxify_1.proxify)('IFederationRoomEventsModel');
exports.ImportData = (0, proxify_1.proxify)('IImportDataModel');
exports.Imports = (0, proxify_1.proxify)('IImportsModel');
exports.InstanceStatus = (0, proxify_1.proxify)('IInstanceStatusModel');
exports.IntegrationHistory = (0, proxify_1.proxify)('IIntegrationHistoryModel');
exports.Integrations = (0, proxify_1.proxify)('IIntegrationsModel');
exports.Invites = (0, proxify_1.proxify)('IInvitesModel');
exports.LivechatAgentActivity = (0, proxify_1.proxify)('ILivechatAgentActivityModel');
exports.LivechatBusinessHours = (0, proxify_1.proxify)('ILivechatBusinessHoursModel');
exports.LivechatContacts = (0, proxify_1.proxify)('ILivechatContactsModel');
exports.LivechatCustomField = (0, proxify_1.proxify)('ILivechatCustomFieldModel');
exports.LivechatDepartmentAgents = (0, proxify_1.proxify)('ILivechatDepartmentAgentsModel');
exports.LivechatDepartment = (0, proxify_1.proxify)('ILivechatDepartmentModel');
exports.LivechatInquiry = (0, proxify_1.proxify)('ILivechatInquiryModel');
exports.LivechatPriority = (0, proxify_1.proxify)('ILivechatPriorityModel');
exports.LivechatRooms = (0, proxify_1.proxify)('ILivechatRoomsModel');
exports.LivechatTag = (0, proxify_1.proxify)('ILivechatTagModel');
exports.LivechatTrigger = (0, proxify_1.proxify)('ILivechatTriggerModel');
exports.LivechatVisitors = (0, proxify_1.proxify)('ILivechatVisitorsModel');
exports.LivechatUnit = (0, proxify_1.proxify)('ILivechatUnitModel');
exports.LivechatUnitMonitors = (0, proxify_1.proxify)('ILivechatUnitMonitorsModel');
exports.LoginServiceConfiguration = (0, proxify_1.proxify)('ILoginServiceConfigurationModel');
exports.Messages = (0, proxify_1.proxify)('IMessagesModel');
exports.NotificationQueue = (0, proxify_1.proxify)('INotificationQueueModel');
exports.Nps = (0, proxify_1.proxify)('INpsModel');
exports.NpsVote = (0, proxify_1.proxify)('INpsVoteModel');
exports.OAuthApps = (0, proxify_1.proxify)('IOAuthAppsModel');
exports.OAuthAuthCodes = (0, proxify_1.proxify)('IOAuthAuthCodesModel');
exports.OAuthAccessTokens = (0, proxify_1.proxify)('IOAuthAccessTokensModel');
exports.OAuthRefreshTokens = (0, proxify_1.proxify)('IOAuthRefreshTokensModel');
exports.OEmbedCache = (0, proxify_1.proxify)('IOEmbedCacheModel');
exports.PbxEvents = (0, proxify_1.proxify)('IPbxEventsModel');
exports.PushToken = (0, proxify_1.proxify)('IPushTokenModel');
exports.Permissions = (0, proxify_1.proxify)('IPermissionsModel');
exports.ReadReceipts = (0, proxify_1.proxify)('IReadReceiptsModel');
exports.MessageReads = (0, proxify_1.proxify)('IMessageReadsModel');
exports.Reports = (0, proxify_1.proxify)('IReportsModel');
exports.Roles = (0, proxify_1.proxify)('IRolesModel');
exports.Rooms = (0, proxify_1.proxify)('IRoomsModel');
exports.ServerEvents = (0, proxify_1.proxify)('IServerEventsModel');
exports.Sessions = (0, proxify_1.proxify)('ISessionsModel');
exports.Settings = (0, proxify_1.proxify)('ISettingsModel');
exports.SmarshHistory = (0, proxify_1.proxify)('ISmarshHistoryModel');
exports.Statistics = (0, proxify_1.proxify)('IStatisticsModel');
exports.Subscriptions = (0, proxify_1.proxify)('ISubscriptionsModel');
exports.TeamMember = (0, proxify_1.proxify)('ITeamMemberModel');
exports.Team = (0, proxify_1.proxify)('ITeamModel');
exports.Users = (0, proxify_1.proxify)('IUsersModel');
exports.Uploads = (0, proxify_1.proxify)('IUploadsModel');
exports.UserDataFiles = (0, proxify_1.proxify)('IUserDataFilesModel');
exports.UsersSessions = (0, proxify_1.proxify)('IUsersSessionsModel');
exports.VideoConference = (0, proxify_1.proxify)('IVideoConferenceModel');
exports.VoipRoom = (0, proxify_1.proxify)('IVoipRoomModel');
exports.WebdavAccounts = (0, proxify_1.proxify)('IWebdavAccountsModel');
exports.MatrixBridgedRoom = (0, proxify_1.proxify)('IMatrixBridgedRoomModel');
exports.MatrixBridgedUser = (0, proxify_1.proxify)('IMatrixBridgedUserModel');
exports.CalendarEvent = (0, proxify_1.proxify)('ICalendarEventModel');
exports.OmnichannelServiceLevelAgreements = (0, proxify_1.proxify)('IOmnichannelServiceLevelAgreementsModel');
exports.AuditLog = (0, proxify_1.proxify)('IAuditLogModel');
exports.CronHistory = (0, proxify_1.proxify)('ICronHistoryModel');
exports.Migrations = (0, proxify_1.proxify)('IMigrationsModel');
exports.ModerationReports = (0, proxify_1.proxify)('IModerationReportsModel');
exports.WorkspaceCredentials = (0, proxify_1.proxify)('IWorkspaceCredentialsModel');