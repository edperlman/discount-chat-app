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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppLogsItemEntry_1 = __importDefault(require("./AppLogsItemEntry"));
const AppLogsItem = (_a) => {
    var { entries, instanceId, title } = _a, props = __rest(_a, ["entries", "instanceId", "title"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Accordion.Item, Object.assign({ title: title }, props, { children: [instanceId && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'default', children: [t('Instance'), ": ", instanceId] })), entries.map(({ severity, timestamp, caller, args }, i) => ((0, jsx_runtime_1.jsx)(AppLogsItemEntry_1.default, { severity: severity, timestamp: timestamp, caller: caller, args: args }, i)))] })));
};
exports.default = AppLogsItem;
