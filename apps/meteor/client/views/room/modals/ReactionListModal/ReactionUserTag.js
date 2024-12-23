"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ReactionUserTag = ({ displayName }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 4, mbe: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'primary', children: displayName }) }));
exports.default = ReactionUserTag;
