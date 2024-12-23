"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomLayout_1 = __importDefault(require("./layout/RoomLayout"));
const NotFoundState_1 = __importDefault(require("../../components/NotFoundState"));
const SidebarToggler_1 = __importDefault(require("../../components/SidebarToggler"));
const RoomNotFound = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    return ((0, jsx_runtime_1.jsx)(RoomLayout_1.default, { header: isMobile && ((0, jsx_runtime_1.jsx)(ui_client_1.Header, { justifyContent: 'start', children: (0, jsx_runtime_1.jsx)(ui_client_1.HeaderToolbar, { children: (0, jsx_runtime_1.jsx)(SidebarToggler_1.default, {}) }) })), body: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: 'full', children: (0, jsx_runtime_1.jsx)(NotFoundState_1.default, { title: t('Room_not_found'), subtitle: t('Room_not_exist_or_not_permission') }) }) }));
};
exports.default = RoomNotFound;
