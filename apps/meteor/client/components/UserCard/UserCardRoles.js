"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const UserCardInfo_1 = __importDefault(require("./UserCardInfo"));
const UserCardRoles = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { m: 'neg-x2', children: (0, jsx_runtime_1.jsx)(UserCardInfo_1.default, { flexWrap: 'wrap', display: 'flex', flexShrink: 0, children: children }) }));
exports.default = UserCardRoles;
