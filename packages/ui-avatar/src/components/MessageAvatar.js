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
const UserAvatar_1 = __importDefault(require("./UserAvatar"));
const MessageAvatar = (_a) => {
    var { emoji, avatarUrl, username, size = 'x36' } = _a, props = __rest(_a, ["emoji", "avatarUrl", "username", "size"]);
    if (emoji) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.AvatarContainer, Object.assign({ size: size }, props, { children: emoji })));
    }
    return (0, jsx_runtime_1.jsx)(UserAvatar_1.default, Object.assign({ url: avatarUrl, username: username, size: size }, props));
};
exports.default = MessageAvatar;
