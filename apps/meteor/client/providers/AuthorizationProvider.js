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
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importStar(require("react"));
const client_1 = require("../../app/authorization/client");
const Roles_1 = require("../../app/models/client/models/Roles");
const useReactiveValue_1 = require("../hooks/useReactiveValue");
const createReactiveSubscriptionFactory_1 = require("../lib/createReactiveSubscriptionFactory");
class RoleStore extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.roles = {};
    }
}
const contextValue = {
    queryPermission: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((permission, scope, scopeRoles) => (0, client_1.hasPermission)(permission, scope, scopeRoles)),
    queryAtLeastOnePermission: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((permissions, scope) => (0, client_1.hasAtLeastOnePermission)(permissions, scope)),
    queryAllPermissions: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((permissions, scope) => (0, client_1.hasAllPermission)(permissions, scope)),
    queryRole: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((role, scope, ignoreSubscriptions = false) => !!meteor_1.Meteor.userId() && (0, client_1.hasRole)(meteor_1.Meteor.userId(), role, scope, ignoreSubscriptions)),
    roleStore: new RoleStore(),
};
const AuthorizationProvider = ({ children }) => {
    const roles = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => Roles_1.Roles.find()
        .fetch()
        .reduce((ret, obj) => {
        ret[obj._id] = obj;
        return ret;
    }, {}), []));
    (0, react_1.useEffect)(() => {
        contextValue.roleStore.roles = roles;
        contextValue.roleStore.emit('change', roles);
    }, [roles]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.AuthorizationContext.Provider, { children: children, value: contextValue });
};
exports.default = AuthorizationProvider;
