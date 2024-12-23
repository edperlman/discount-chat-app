"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const getUserDisplayName_1 = require("../../../../../lib/getUserDisplayName");
const useUserInfoQuery_1 = require("../../../../hooks/useUserInfoQuery");
const RoomForewordUsernameListItem = ({ username, href, useRealName }) => {
    var _a;
    const { data, isLoading, isError } = (0, useUserInfoQuery_1.useUserInfoQuery)({ username });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Tag, { icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user', size: 'x20' }), "data-username": username, large: true, href: href, children: [isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect' }), !isLoading && isError && username, !isLoading && !isError && (0, getUserDisplayName_1.getUserDisplayName)((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.name, username, useRealName)] }));
};
exports.default = RoomForewordUsernameListItem;
