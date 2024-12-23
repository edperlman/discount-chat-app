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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const tracker_1 = require("meteor/tracker");
const react_1 = __importStar(require("react"));
const createReactiveSubscriptionFactory_1 = require("../lib/createReactiveSubscriptionFactory");
const queryClient_1 = require("../lib/queryClient");
const PrivateSettingsCachedCollection_1 = require("../lib/settings/PrivateSettingsCachedCollection");
const PublicSettingsCachedCollection_1 = require("../lib/settings/PublicSettingsCachedCollection");
const SettingsProvider = ({ children, privileged = false }) => {
    const hasPrivilegedPermission = (0, ui_contexts_1.useAtLeastOnePermission)((0, react_1.useMemo)(() => ['view-privileged-setting', 'edit-privileged-setting', 'manage-selected-settings'], []));
    const hasPrivateAccess = privileged && hasPrivilegedPermission;
    const cachedCollection = (0, react_1.useMemo)(() => (hasPrivateAccess ? PrivateSettingsCachedCollection_1.PrivateSettingsCachedCollection : PublicSettingsCachedCollection_1.PublicSettingsCachedCollection), [hasPrivateAccess]);
    const [isLoading, setLoading] = (0, react_1.useState)(() => tracker_1.Tracker.nonreactive(() => !cachedCollection.ready.get()));
    (0, react_1.useEffect)(() => {
        let mounted = true;
        const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!tracker_1.Tracker.nonreactive(() => cachedCollection.ready.get())) {
                yield cachedCollection.init();
            }
            if (!mounted) {
                return;
            }
            setLoading(false);
        });
        initialize();
        return () => {
            mounted = false;
        };
    }, [cachedCollection]);
    const querySetting = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((_id) => {
        const subscription = cachedCollection.collection.findOne(_id);
        return subscription ? Object.assign({}, subscription) : undefined;
    }), [cachedCollection]);
    const querySettings = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((query = {}) => cachedCollection.collection
        .find(Object.assign(Object.assign(Object.assign(Object.assign({}, ('_id' in query && Array.isArray(query._id) && { _id: { $in: query._id } })), ('_id' in query && !Array.isArray(query._id) && { _id: query._id })), ('group' in query && { group: query.group })), ('section' in query &&
        (query.section
            ? { section: query.section }
            : {
                $or: [{ section: { $exists: false } }, { section: undefined }],
            }))), {
        sort: {
            section: 1,
            sorter: 1,
            i18nLabel: 1,
        },
    })
        .fetch()), [cachedCollection]);
    const settingsChangeCallback = (changes) => {
        changes.forEach((val) => {
            switch (val._id) {
                case 'Enterprise_License':
                    queryClient_1.queryClient.invalidateQueries(['licenses']);
                    break;
                default:
                    break;
            }
        });
    };
    const saveSettings = (0, ui_contexts_1.useMethod)('saveSettings');
    const dispatch = (0, react_1.useCallback)((changes) => __awaiter(void 0, void 0, void 0, function* () {
        settingsChangeCallback(changes);
        yield saveSettings(changes);
    }), [saveSettings]);
    const contextValue = (0, react_1.useMemo)(() => ({
        hasPrivateAccess,
        isLoading,
        querySetting,
        querySettings,
        dispatch,
    }), [hasPrivateAccess, isLoading, querySetting, querySettings, dispatch]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.SettingsContext.Provider, { children: children, value: contextValue });
};
exports.default = SettingsProvider;
