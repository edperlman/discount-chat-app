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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
function UserStatus(_a) {
    var { small, status } = _a, props = __rest(_a, ["small", "status"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const size = small ? 'small' : 'large';
    switch (status) {
        case 'online':
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, status: status }, props));
        case 'busy':
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, status: status }, props));
        case 'away':
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, status: status }, props));
        case 'offline':
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, status: status }, props));
        case 'disabled':
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, status: status }, props));
        default:
            return (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, Object.assign({ size: size, title: t('Loading') }, props));
    }
}
exports.default = (0, react_1.memo)(UserStatus);
