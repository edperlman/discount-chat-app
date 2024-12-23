"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useCreateRoomMenu_1 = require("./hooks/useCreateRoomMenu");
const CreateRoom = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const sections = (0, useCreateRoomMenu_1.useCreateRoom)();
    return (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, Object.assign({ icon: 'edit-rounded', sections: sections, title: t('Create_new'), is: fuselage_1.Sidebar.TopBar.Action }, props));
};
exports.default = CreateRoom;
