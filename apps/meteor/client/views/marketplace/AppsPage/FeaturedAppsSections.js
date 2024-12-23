"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppsList_1 = __importDefault(require("../AppsList"));
const normalizeFeaturedApps_1 = __importDefault(require("../helpers/normalizeFeaturedApps"));
const useFeaturedApps_1 = require("../hooks/useFeaturedApps");
const FeaturedAppsSections = ({ appsResult, appsListId }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const featuredApps = (0, useFeaturedApps_1.useFeaturedApps)();
    if (featuredApps.isSuccess) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: featuredApps.data.sections.map((section, index) => ((0, jsx_runtime_1.jsx)(AppsList_1.default, { appsListId: `${appsListId + index}`, apps: (0, normalizeFeaturedApps_1.default)(section.apps, appsResult), title: i18n.exists(section.i18nLabel) ? t(section.i18nLabel) : section.i18nLabel }, section.slug))) }));
    }
    return null;
};
exports.default = FeaturedAppsSections;
