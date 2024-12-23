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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importStar(require("react"));
const useLDAPAndCrowdCollisionWarning_1 = require("./hooks/useLDAPAndCrowdCollisionWarning");
const loginServices_1 = require("../../lib/loginServices");
const AuthenticationProvider = ({ children }) => {
    const isLdapEnabled = (0, ui_contexts_1.useSetting)('LDAP_Enable', false);
    const isCrowdEnabled = (0, ui_contexts_1.useSetting)('CROWD_Enable', false);
    const loginMethod = (isLdapEnabled && 'loginWithLDAP') || (isCrowdEnabled && 'loginWithCrowd') || 'loginWithPassword';
    (0, useLDAPAndCrowdCollisionWarning_1.useLDAPAndCrowdCollisionWarning)();
    const contextValue = (0, react_1.useMemo)(() => ({
        loginWithToken: (token) => new Promise((resolve, reject) => meteor_1.Meteor.loginWithToken(token, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(undefined);
        })),
        loginWithPassword: (user, password) => new Promise((resolve, reject) => {
            meteor_1.Meteor[loginMethod](user, password, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        }),
        loginWithService: (serviceConfig) => {
            const loginMethods = {
                'meteor-developer': 'MeteorDeveloperAccount',
            };
            const { service: serviceName } = serviceConfig;
            const clientConfig = ('clientConfig' in serviceConfig && serviceConfig.clientConfig) || {};
            const loginWithService = `loginWith${loginMethods[serviceName] || (0, string_helpers_1.capitalize)(String(serviceName || ''))}`;
            const method = meteor_1.Meteor[loginWithService];
            if (!method) {
                return () => Promise.reject(new Error('Login method not found'));
            }
            return () => new Promise((resolve, reject) => {
                method(clientConfig, (error) => {
                    if (!error) {
                        resolve(true);
                        return;
                    }
                    reject(error);
                });
            });
        },
        queryLoginServices: {
            getCurrentValue: () => loginServices_1.loginServices.getLoginServiceButtons(),
            subscribe: (onStoreChange) => loginServices_1.loginServices.on('changed', onStoreChange),
        },
    }), [loginMethod]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.AuthenticationContext.Provider, { children: children, value: contextValue });
};
exports.default = AuthenticationProvider;
