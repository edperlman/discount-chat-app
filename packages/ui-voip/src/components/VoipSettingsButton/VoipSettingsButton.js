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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable react/no-multi-comp */
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = require("react");
const useVoipDeviceSettings_1 = require("./hooks/useVoipDeviceSettings");
const CustomizeButton = (0, react_1.forwardRef)(function CustomizeButton(_a, ref) {
    var { mini } = _a, props = __rest(_a, ["mini"]);
    const size = mini ? 24 : 32;
    return (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, Object.assign({}, props, { ref: ref, icon: 'customize', mini: true, width: size, height: size }));
});
const VoipSettingsButton = ({ mini = false }) => {
    const menu = (0, useVoipDeviceSettings_1.useVoipDeviceSettings)();
    return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { is: CustomizeButton, title: menu.title, disabled: menu.disabled, sections: menu.sections, selectionMode: 'multiple', placement: 'top-end', icon: 'customize', mini: mini }));
};
exports.default = VoipSettingsButton;
