"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAvatars = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../../helpers/createClassName");
const Avatar_1 = require("../../Avatar");
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.MessageAvatars = (0, compat_1.memo)(({ avatarResolver = () => undefined, usernames = [], className, style = {} }) => {
    const avatars = usernames.filter(Boolean);
    if (!avatars.length) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-avatars', {}, [className]), style: style, children: avatars.map((username) => ((0, jsx_runtime_1.jsx)(Avatar_1.Avatar, { src: avatarResolver(username), description: username, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-avatars__avatar') }))) }));
});
