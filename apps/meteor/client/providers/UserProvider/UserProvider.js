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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importStar(require("react"));
const useClearRemovedRoomsHistory_1 = require("./hooks/useClearRemovedRoomsHistory");
const useDeleteUser_1 = require("./hooks/useDeleteUser");
const useEmailVerificationWarning_1 = require("./hooks/useEmailVerificationWarning");
const useUpdateAvatar_1 = require("./hooks/useUpdateAvatar");
const client_1 = require("../../../app/models/client");
const client_2 = require("../../../app/utils/client");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const afterLogoutCleanUpCallback_1 = require("../../../lib/callbacks/afterLogoutCleanUpCallback");
const useReactiveValue_1 = require("../../hooks/useReactiveValue");
const createReactiveSubscriptionFactory_1 = require("../../lib/createReactiveSubscriptionFactory");
const queryClient_1 = require("../../lib/queryClient");
const useCreateFontStyleElement_1 = require("../../views/account/accessibility/hooks/useCreateFontStyleElement");
const getUser = () => meteor_1.Meteor.user();
const getUserId = () => meteor_1.Meteor.userId();
const logout = () => new Promise((resolve, reject) => {
    const user = getUser();
    if (!user) {
        return resolve();
    }
    meteor_1.Meteor.logout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.run(user);
        SDKClient_1.sdk.call('logoutCleanUp', user).then(resolve, reject);
    }));
});
const UserProvider = ({ children }) => {
    var _a, _b;
    const user = (0, useReactiveValue_1.useReactiveValue)(getUser);
    const userId = (0, useReactiveValue_1.useReactiveValue)(getUserId);
    const previousUserId = (0, react_1.useRef)(userId);
    const [userLanguage, setUserLanguage] = (0, fuselage_hooks_1.useLocalStorage)('userLanguage', '');
    const [preferedLanguage, setPreferedLanguage] = (0, fuselage_hooks_1.useLocalStorage)('preferedLanguage', '');
    const setUserPreferences = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const createFontStyleElement = (0, useCreateFontStyleElement_1.useCreateFontStyleElement)();
    createFontStyleElement((_b = (_a = user === null || user === void 0 ? void 0 : user.settings) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.fontSize);
    (0, useEmailVerificationWarning_1.useEmailVerificationWarning)(user !== null && user !== void 0 ? user : undefined);
    (0, useClearRemovedRoomsHistory_1.useClearRemovedRoomsHistory)(userId);
    (0, useDeleteUser_1.useDeleteUser)();
    (0, useUpdateAvatar_1.useUpdateAvatar)();
    const contextValue = (0, react_1.useMemo)(() => ({
        userId,
        user,
        queryPreference: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((key, defaultValue) => (0, client_2.getUserPreference)(userId, key, defaultValue)),
        querySubscription: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((query, fields, sort) => client_1.Subscriptions.findOne(query, { fields, sort })),
        queryRoom: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((query, fields) => client_1.Rooms.findOne(query, { fields })),
        querySubscriptions: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((query, options) => {
            if (userId) {
                return client_1.Subscriptions.find(query, options).fetch();
            }
            return client_1.Rooms.find(query, options).fetch();
        }),
        logout,
    }), [userId, user]);
    (0, react_1.useEffect)(() => {
        if (!!userId && preferedLanguage !== userLanguage) {
            setUserPreferences({ data: { language: preferedLanguage } });
            setUserLanguage(preferedLanguage);
        }
        if ((user === null || user === void 0 ? void 0 : user.language) !== undefined && user.language !== userLanguage) {
            setUserLanguage(user.language);
            setPreferedLanguage(user.language);
        }
    }, [preferedLanguage, setPreferedLanguage, setUserLanguage, user === null || user === void 0 ? void 0 : user.language, userLanguage, userId, setUserPreferences]);
    (0, react_1.useEffect)(() => {
        if (previousUserId.current && previousUserId.current !== userId) {
            queryClient_1.queryClient.clear();
        }
        previousUserId.current = userId;
    }, [userId]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.UserContext.Provider, { children: children, value: contextValue });
};
exports.default = UserProvider;
