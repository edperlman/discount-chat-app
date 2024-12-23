"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const MAX_USERS = 3;
const VideoConfMessageUserStack = ({ users }) => {
    const getUserAvatarPath = (0, ui_contexts_1.useUserAvatarPath)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', mi: 'neg-x2', children: users.slice(0, MAX_USERS).map(({ username }, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 2, children: (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { size: 'x28', alt: username || '', "data-tooltip": username, url: getUserAvatarPath(username) }) }, index))) }) }));
};
exports.default = (0, react_1.memo)(VideoConfMessageUserStack);
