"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const AnnouncementComponent = ({ children, onClickOpen }) => ((0, jsx_runtime_1.jsx)(ui_client_1.RoomBanner, { className: 'rcx-header-section rcx-announcement-section', onClick: onClickOpen, children: (0, jsx_runtime_1.jsx)(ui_client_1.RoomBannerContent, { "data-qa": 'AnnouncementAnnoucementComponent', children: children }) }));
exports.default = AnnouncementComponent;
