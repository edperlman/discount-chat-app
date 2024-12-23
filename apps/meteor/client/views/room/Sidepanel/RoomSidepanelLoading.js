"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const RoomSidepanelLoading = () => ((0, jsx_runtime_1.jsx)(fuselage_1.Sidepanel, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.SidepanelList, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2Item, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2Item, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2Item, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' }) })] }) }));
exports.default = RoomSidepanelLoading;
