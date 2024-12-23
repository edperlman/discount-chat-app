"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userScopes = exports.workspaceScopes = void 0;
// These are the scopes we by default request access to
exports.workspaceScopes = [
    'workspace:license:read',
    'workspace:client:write',
    'workspace:stats:write',
    'workspace:push:send',
    'marketplace:read',
    'marketplace:download',
    'fedhub:register',
];
// These are the scopes we use for the user
exports.userScopes = ['openid', 'offline_access'];
