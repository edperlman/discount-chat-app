"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServiceModels = registerServiceModels;
const models_1 = require("@rocket.chat/models");
const EmailInbox_1 = require("../../../server/models/raw/EmailInbox");
const InstanceStatus_1 = require("../../../server/models/raw/InstanceStatus");
const IntegrationHistory_1 = require("../../../server/models/raw/IntegrationHistory");
const Integrations_1 = require("../../../server/models/raw/Integrations");
const LivechatDepartmentAgents_1 = require("../../../server/models/raw/LivechatDepartmentAgents");
const LivechatInquiry_1 = require("../../../server/models/raw/LivechatInquiry");
const LivechatRooms_1 = require("../../../server/models/raw/LivechatRooms");
const LivechatVisitors_1 = require("../../../server/models/raw/LivechatVisitors");
const LoginServiceConfiguration_1 = require("../../../server/models/raw/LoginServiceConfiguration");
const Messages_1 = require("../../../server/models/raw/Messages");
const PbxEvents_1 = require("../../../server/models/raw/PbxEvents");
const Permissions_1 = require("../../../server/models/raw/Permissions");
const Roles_1 = require("../../../server/models/raw/Roles");
const Rooms_1 = require("../../../server/models/raw/Rooms");
const Settings_1 = require("../../../server/models/raw/Settings");
const Subscriptions_1 = require("../../../server/models/raw/Subscriptions");
const Team_1 = require("../../../server/models/raw/Team");
const TeamMember_1 = require("../../../server/models/raw/TeamMember");
const Uploads_1 = require("../../../server/models/raw/Uploads");
const Users_1 = require("../../../server/models/raw/Users");
const UsersSessions_1 = require("../../../server/models/raw/UsersSessions");
const LivechatPriority_1 = require("../models/raw/LivechatPriority");
// TODO add trash param to appropiate model instances
function registerServiceModels(db, trash) {
    (0, models_1.registerModel)('IRolesModel', () => new Roles_1.RolesRaw(db));
    (0, models_1.registerModel)('IRoomsModel', () => new Rooms_1.RoomsRaw(db));
    (0, models_1.registerModel)('ISettingsModel', () => new Settings_1.SettingsRaw(db, trash));
    (0, models_1.registerModel)('ISubscriptionsModel', () => new Subscriptions_1.SubscriptionsRaw(db, trash));
    (0, models_1.registerModel)('ITeamModel', () => new Team_1.TeamRaw(db));
    (0, models_1.registerModel)('ITeamMemberModel', () => new TeamMember_1.TeamMemberRaw(db));
    (0, models_1.registerModel)('IUsersModel', () => new Users_1.UsersRaw(db));
    (0, models_1.registerModel)('IMessagesModel', () => new Messages_1.MessagesRaw(db));
    (0, models_1.registerModel)('ILivechatInquiryModel', () => new LivechatInquiry_1.LivechatInquiryRaw(db, trash));
    (0, models_1.registerModel)('ILivechatDepartmentAgentsModel', () => new LivechatDepartmentAgents_1.LivechatDepartmentAgentsRaw(db, trash));
    (0, models_1.registerModel)('IUsersSessionsModel', () => new UsersSessions_1.UsersSessionsRaw(db));
    (0, models_1.registerModel)('IPermissionsModel', () => new Permissions_1.PermissionsRaw(db));
    (0, models_1.registerModel)('ILoginServiceConfigurationModel', () => new LoginServiceConfiguration_1.LoginServiceConfigurationRaw(db));
    (0, models_1.registerModel)('IInstanceStatusModel', () => new InstanceStatus_1.InstanceStatusRaw(db));
    (0, models_1.registerModel)('IIntegrationHistoryModel', () => new IntegrationHistory_1.IntegrationHistoryRaw(db));
    (0, models_1.registerModel)('IIntegrationsModel', () => new Integrations_1.IntegrationsRaw(db));
    (0, models_1.registerModel)('IEmailInboxModel', () => new EmailInbox_1.EmailInboxRaw(db));
    (0, models_1.registerModel)('IPbxEventsModel', () => new PbxEvents_1.PbxEventsRaw(db));
    (0, models_1.registerModel)('ILivechatPriorityModel', new LivechatPriority_1.LivechatPriorityRaw(db));
    (0, models_1.registerModel)('ILivechatRoomsModel', () => new LivechatRooms_1.LivechatRoomsRaw(db));
    (0, models_1.registerModel)('IUploadsModel', () => new Uploads_1.UploadsRaw(db));
    (0, models_1.registerModel)('ILivechatVisitorsModel', () => new LivechatVisitors_1.LivechatVisitorsRaw(db));
}