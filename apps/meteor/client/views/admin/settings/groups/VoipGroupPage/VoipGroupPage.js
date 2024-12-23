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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const VoipExtensionsPage_1 = __importDefault(require("./VoipExtensionsPage"));
const GenericNoResults_1 = __importDefault(require("../../../../../components/GenericNoResults"));
const Page_1 = require("../../../../../components/Page");
const EditableSettingsContext_1 = require("../../../EditableSettingsContext");
const SettingsGroupPage_1 = __importDefault(require("../../SettingsGroupPage"));
const SettingsSection_1 = __importDefault(require("../../SettingsSection"));
function VoipGroupPage(_a) {
    var { _id, onClickBack } = _a, group = __rest(_a, ["_id", "onClickBack"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const voipEnabled = (0, ui_contexts_1.useSetting)('VoIP_Enabled');
    const tabs = ['Settings', 'Extensions'];
    const [tab, setTab] = (0, react_1.useState)(tabs[0]);
    const handleTabClick = (0, react_1.useMemo)(() => (tab) => () => setTab(tab), [setTab]);
    const sections = (0, EditableSettingsContext_1.useEditableSettingsGroupSections)('VoIP_Omnichannel', tab);
    if (!tab && tabs[0]) {
        setTab(tabs[0]);
    }
    const tabsComponent = ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs, { children: tabs.map((tabName) => ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === tabName, onClick: handleTabClick(tabName), children: tabName ? t(tabName) : t(_id) }, tabName || ''))) }));
    const ExtensionsPageComponent = (0, react_1.useMemo)(() => voipEnabled ? ((0, jsx_runtime_1.jsx)(VoipExtensionsPage_1.default, {})) : ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'warning', title: t('Voip_is_disabled'), description: t('Voip_is_disabled_description') })), [t, voipEnabled]);
    return ((0, jsx_runtime_1.jsx)(SettingsGroupPage_1.default, Object.assign({ _id: _id }, group, { tabs: tabsComponent, isCustom: true, onClickBack: onClickBack, children: tab === 'Extensions' ? (ExtensionsPageComponent) : ((0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginBlock: 'none', marginInline: 'auto', width: 'full', maxWidth: 'x580', children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { className: 'page-settings', children: sections.map((sectionName) => ((0, jsx_runtime_1.jsx)(SettingsSection_1.default, { groupId: _id, sectionName: sectionName, currentTab: tab, solo: false }, sectionName || ''))) }) }) })) })));
}
exports.default = (0, react_1.memo)(VoipGroupPage);
