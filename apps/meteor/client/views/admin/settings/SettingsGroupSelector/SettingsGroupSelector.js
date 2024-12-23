"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const SettingsGroupPageSkeleton_1 = __importDefault(require("../SettingsGroupPage/SettingsGroupPageSkeleton"));
const BaseGroupPage_1 = __importDefault(require("../groups/BaseGroupPage"));
const LDAPGroupPage_1 = __importDefault(require("../groups/LDAPGroupPage"));
const OAuthGroupPage_1 = __importDefault(require("../groups/OAuthGroupPage"));
const VoipGroupPage_1 = __importDefault(require("../groups/VoipGroupPage"));
const SettingsGroupSelector = ({ groupId, onClickBack }) => {
    const group = (0, ui_contexts_1.useSettingStructure)(groupId);
    if (!group) {
        return (0, jsx_runtime_1.jsx)(SettingsGroupPageSkeleton_1.default, {});
    }
    if (groupId === 'OAuth') {
        return (0, jsx_runtime_1.jsx)(OAuthGroupPage_1.default, Object.assign({}, group, { onClickBack: onClickBack }));
    }
    if (groupId === 'LDAP') {
        return (0, jsx_runtime_1.jsx)(LDAPGroupPage_1.default, Object.assign({}, group, { onClickBack: onClickBack }));
    }
    if (groupId === 'VoIP_Omnichannel') {
        return (0, jsx_runtime_1.jsx)(VoipGroupPage_1.default, Object.assign({}, group, { onClickBack: onClickBack }));
    }
    if (groupId === 'Assets') {
        return (0, jsx_runtime_1.jsx)(BaseGroupPage_1.default, Object.assign({}, group, { onClickBack: onClickBack, hasReset: false }));
    }
    return (0, jsx_runtime_1.jsx)(BaseGroupPage_1.default, Object.assign({}, group, { onClickBack: onClickBack }));
};
exports.default = SettingsGroupSelector;
