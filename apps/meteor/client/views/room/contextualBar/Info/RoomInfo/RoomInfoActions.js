"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const InfoPanel_1 = require("../../../../../components/InfoPanel");
const RoomInfoActions = ({ actions, className }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: actions.items.map(({ id, content, icon, onClick }) => ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelAction, { className: className, label: content, onClick: onClick, icon: icon }, id))) }));
};
exports.default = RoomInfoActions;
