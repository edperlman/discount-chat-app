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
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_2 = __importDefault(require("react"));
const UserAutoCompleteMultipleOption = (_a) => {
    var { label } = _a, props = __rest(_a, ["label"]);
    const { name, username, _federated } = label;
    return ((0, react_1.createElement)(fuselage_1.Option, Object.assign({}, props, { "data-qa-type": 'autocomplete-user-option', avatar: _federated ? undefined : (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username || '', size: 'x20' }), icon: _federated ? 'globe' : undefined, key: username, label: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [name || username, " ", !_federated && (0, jsx_runtime_1.jsxs)(fuselage_1.OptionDescription, { children: ["(", username, ")"] })] })), children: undefined })));
};
exports.default = UserAutoCompleteMultipleOption;
