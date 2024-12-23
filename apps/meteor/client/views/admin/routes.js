"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminRoute = void 0;
const react_1 = require("react");
const createRouteGroup_1 = require("../../lib/createRouteGroup");
exports.registerAdminRoute = (0, createRouteGroup_1.createRouteGroup)('admin', '/admin', (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./AdministrationRouter')))));
(0, exports.registerAdminRoute)('/sounds/:context?/:id?', {
    name: 'custom-sounds',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./customSounds/CustomSoundsRoute')))),
});
/** @deprecated in favor of `/workspace` route, this is a fallback to work in Mobile app, should be removed in the next major  */
(0, exports.registerAdminRoute)('/info', {
    name: 'info',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./workspace/WorkspaceRoute')))),
});
(0, exports.registerAdminRoute)('/workspace', {
    name: 'workspace',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./workspace/WorkspaceRoute')))),
});
(0, exports.registerAdminRoute)('/import', {
    name: 'admin-import',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./import/ImportRoute')))),
    props: { page: 'history' },
});
(0, exports.registerAdminRoute)('/import/new/:importerKey?', {
    name: 'admin-import-new',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./import/ImportRoute')))),
    props: { page: 'new' },
});
(0, exports.registerAdminRoute)('/import/prepare', {
    name: 'admin-import-prepare',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./import/ImportRoute')))),
    props: { page: 'prepare' },
});
(0, exports.registerAdminRoute)('/import/progress', {
    name: 'admin-import-progress',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./import/ImportRoute')))),
    props: { page: 'progress' },
});
(0, exports.registerAdminRoute)('/mailer', {
    name: 'admin-mailer',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./mailer/MailerRoute')))),
});
(0, exports.registerAdminRoute)('/third-party-login/:context?/:id?', {
    name: 'admin-oauth-apps',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./oauthApps/OAuthAppsRoute')))),
});
(0, exports.registerAdminRoute)('/integrations/:context?/:type?/:id?', {
    name: 'admin-integrations',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./integrations/IntegrationsRoute')))),
});
(0, exports.registerAdminRoute)('/user-status/:context?/:id?', {
    name: 'user-status',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./customUserStatus/CustomUserStatusRoute')))),
});
(0, exports.registerAdminRoute)('/emoji/:context?/:id?', {
    name: 'emoji-custom',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./customEmoji/CustomEmojiRoute')))),
});
(0, exports.registerAdminRoute)('/users/:context?/:id?', {
    name: 'admin-users',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./users/AdminUsersRoute')))),
});
(0, exports.registerAdminRoute)('/rooms/:context?/:id?', {
    name: 'admin-rooms',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./rooms/RoomsRoute')))),
});
(0, exports.registerAdminRoute)('/invites', {
    name: 'invites',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./invites/InvitesRoute')))),
});
(0, exports.registerAdminRoute)('/reports', {
    name: 'admin-view-logs',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./viewLogs/ViewLogsRoute')))),
});
(0, exports.registerAdminRoute)('/federation', {
    name: 'federation-dashboard',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./federationDashboard/FederationDashboardRoute')))),
});
(0, exports.registerAdminRoute)('/permissions/:context?/:_id?', {
    name: 'admin-permissions',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./permissions/PermissionsRouter')))),
});
(0, exports.registerAdminRoute)('/email-inboxes/:context?/:_id?', {
    name: 'admin-email-inboxes',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./emailInbox/EmailInboxRoute')))),
});
(0, exports.registerAdminRoute)('/settings/:group?', {
    name: 'admin-settings',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./settings/SettingsRoute')))),
});
(0, exports.registerAdminRoute)('/moderation/:tab?/:context?/:id?', {
    name: 'moderation-console',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./moderation/ModerationConsoleRoute')))),
});
(0, exports.registerAdminRoute)('/engagement/:tab?', {
    name: 'engagement-dashboard',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./engagementDashboard/EngagementDashboardRoute')))),
});
(0, exports.registerAdminRoute)('/device-management/:context?/:id?', {
    name: 'device-management',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./deviceManagement/DeviceManagementAdminRoute')))),
});
(0, exports.registerAdminRoute)('/subscription', {
    name: 'subscription',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./subscription/SubscriptionRoute')))),
});
(0, exports.registerAdminRoute)('/feature-preview', {
    name: 'admin-feature-preview',
    component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./featurePreview/AdminFeaturePreviewRoute')))),
});
