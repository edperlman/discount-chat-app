"use strict";
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
const react_1 = __importDefault(require("react"));
const GenericGroupPage_1 = __importDefault(require("./GenericGroupPage"));
const TabbedGroupPage_1 = __importDefault(require("./TabbedGroupPage"));
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
const BaseGroupPage = (_a) => {
    var { _id, i18nLabel, headerButtons, hasReset, onClickBack } = _a, props = __rest(_a, ["_id", "i18nLabel", "headerButtons", "hasReset", "onClickBack"]);
    const tabs = (0, EditableSettingsContext_1.useEditableSettingsGroupTabs)(_id);
    const sections = (0, EditableSettingsContext_1.useEditableSettingsGroupSections)(_id);
    if (tabs.length > 1) {
        return ((0, jsx_runtime_1.jsx)(TabbedGroupPage_1.default, Object.assign({ _id: _id, i18nLabel: i18nLabel, headerButtons: headerButtons, tabs: tabs, onClickBack: onClickBack }, props)));
    }
    return (0, jsx_runtime_1.jsx)(GenericGroupPage_1.default, Object.assign({ _id: _id, i18nLabel: i18nLabel, sections: sections, onClickBack: onClickBack, hasReset: hasReset }, props));
};
exports.default = BaseGroupPage;
