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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericGroupPage_1 = __importDefault(require("./GenericGroupPage"));
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
function TabbedGroupPage(_a) {
    var { _id, tabs, i18nLabel, onClickBack } = _a, props = __rest(_a, ["_id", "tabs", "i18nLabel", "onClickBack"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [currentTab, setCurrentTab] = (0, react_1.useState)(tabs[0]);
    const handleTabClick = (0, react_1.useMemo)(() => (tab) => () => setCurrentTab(tab), [setCurrentTab]);
    const sections = (0, EditableSettingsContext_1.useEditableSettingsGroupSections)(_id, currentTab);
    const tabsComponent = ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs, { children: tabs.map((tabName) => ((0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: currentTab === tabName, onClick: handleTabClick(tabName), children: tabName ? t(tabName) : t(_id) }, tabName || ''))) }));
    return ((0, jsx_runtime_1.jsx)(GenericGroupPage_1.default, Object.assign({ _id: _id, i18nLabel: i18nLabel, onClickBack: onClickBack, sections: sections, currentTab: currentTab, tabs: tabsComponent }, props)));
}
exports.default = (0, react_1.memo)(TabbedGroupPage);
