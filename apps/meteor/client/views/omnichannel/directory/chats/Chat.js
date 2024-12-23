"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const RoomOpener_1 = __importDefault(require("../../../room/RoomOpener"));
const Chat = ({ rid }) => {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', backgroundColor: 'surface', width: 'full', height: 'full', children: (0, jsx_runtime_1.jsx)(RoomOpener_1.default, { type: 'l', reference: rid }) }));
};
exports.default = Chat;
