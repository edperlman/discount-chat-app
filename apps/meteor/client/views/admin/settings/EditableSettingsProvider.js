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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const mongo_1 = require("meteor/mongo");
const tracker_1 = require("meteor/tracker");
const react_1 = __importStar(require("react"));
const createReactiveSubscriptionFactory_1 = require("../../../lib/createReactiveSubscriptionFactory");
const EditableSettingsContext_1 = require("../EditableSettingsContext");
const defaultQuery = {};
const defaultOmit = [];
const EditableSettingsProvider = ({ children, query = defaultQuery, omit = defaultOmit }) => {
    const settingsCollectionRef = (0, react_1.useRef)(null);
    const persistedSettings = (0, ui_contexts_1.useSettings)(query);
    const getSettingsCollection = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (!settingsCollectionRef.current) {
            settingsCollectionRef.current = new mongo_1.Mongo.Collection(null);
        }
        return settingsCollectionRef.current;
    });
    (0, react_1.useEffect)(() => {
        const settingsCollection = getSettingsCollection();
        settingsCollection.remove({ _id: { $nin: persistedSettings.map(({ _id }) => _id) } });
        for (let _a of persistedSettings) {
            const { _id } = _a, fields = __rest(_a, ["_id"]);
            settingsCollection.upsert(_id, { $set: Object.assign({}, fields), $unset: { changed: true } });
        }
        // TODO: Remove option to omit settings from admin pages manually
        // This is a very wacky workaround due to lack of support to omit settings from the
        // admin settings page while keeping them public.
        if (omit.length > 0) {
            settingsCollection.remove({ _id: { $in: omit } });
        }
    }, [getSettingsCollection, persistedSettings, omit]);
    const queryEditableSetting = (0, react_1.useMemo)(() => {
        const validateSettingQueries = (query, settingsCollection) => {
            if (!query) {
                return true;
            }
            const queries = [].concat(typeof query === 'string' ? JSON.parse(query) : query);
            return queries.every((query) => settingsCollection.find(query).count() > 0);
        };
        return (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((_id) => {
            const settingsCollection = getSettingsCollection();
            const editableSetting = settingsCollection.findOne(_id);
            if (!editableSetting) {
                return undefined;
            }
            return Object.assign(Object.assign({}, editableSetting), { disabled: editableSetting.blocked || !validateSettingQueries(editableSetting.enableQuery, settingsCollection), invisible: !validateSettingQueries(editableSetting.displayQuery, settingsCollection) });
        });
    }, [getSettingsCollection]);
    const queryEditableSettings = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((query = {}) => getSettingsCollection()
        .find(Object.assign(Object.assign(Object.assign(Object.assign({}, ('_id' in query && { _id: { $in: query._id } })), ('group' in query && { group: query.group })), ('changed' in query && { changed: query.changed })), { $and: [
            Object.assign({}, ('section' in query &&
                (query.section
                    ? { section: query.section }
                    : {
                        $or: [{ section: { $exists: false } }, { section: '' }],
                    }))),
            Object.assign({}, ('tab' in query &&
                (query.tab
                    ? { tab: query.tab }
                    : {
                        $or: [{ tab: { $exists: false } }, { tab: '' }],
                    }))),
        ] }), {
        sort: {
            section: 1,
            sorter: 1,
            i18nLabel: 1,
        },
    })
        .fetch()), [getSettingsCollection]);
    const queryGroupSections = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((_id, tab) => Array.from(new Set(getSettingsCollection()
        .find(Object.assign({ group: _id }, (tab !== undefined
        ? { tab }
        : {
            $or: [{ tab: { $exists: false } }, { tab: '' }],
        })), {
        fields: {
            section: 1,
        },
        sort: {
            sorter: 1,
            section: 1,
            i18nLabel: 1,
        },
    })
        .fetch()
        .map(({ section }) => section || '')))), [getSettingsCollection]);
    const queryGroupTabs = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((_id) => Array.from(new Set(getSettingsCollection()
        .find({
        group: _id,
    }, {
        fields: {
            tab: 1,
        },
        sort: {
            sorter: 1,
            tab: 1,
            i18nLabel: 1,
        },
    })
        .fetch()
        .map(({ tab }) => tab || '')))), [getSettingsCollection]);
    const dispatch = (0, fuselage_hooks_1.useMutableCallback)((changes) => {
        for (let _a of changes) {
            const { _id } = _a, data = __rest(_a, ["_id"]);
            if (!_id) {
                continue;
            }
            getSettingsCollection().update(_id, { $set: data });
        }
        tracker_1.Tracker.flush();
    });
    const contextValue = (0, react_1.useMemo)(() => ({
        queryEditableSetting,
        queryEditableSettings,
        queryGroupSections,
        queryGroupTabs,
        dispatch,
    }), [queryEditableSetting, queryEditableSettings, queryGroupSections, queryGroupTabs, dispatch]);
    return (0, jsx_runtime_1.jsx)(EditableSettingsContext_1.EditableSettingsContext.Provider, { children: children, value: contextValue });
};
exports.default = EditableSettingsProvider;
