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
const useSortMenu_1 = require("./hooks/useSortMenu");
const Sort = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const sections = (0, useSortMenu_1.useSortMenu)();
    return (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, Object.assign({ icon: 'sort', sections: sections, title: t('Display'), selectionMode: 'multiple', is: fuselage_1.SidebarV2Action }, props));
};
exports.default = Sort;
