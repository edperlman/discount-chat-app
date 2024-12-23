"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericResourceUsage_1 = require("../../../components/GenericResourceUsage");
const useActiveConnections_1 = require("../../hooks/useActiveConnections");
const CustomUserActiveConnections = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const result = (0, useActiveConnections_1.useActiveConnections)();
    if (result.isLoading || result.isError) {
        return (0, jsx_runtime_1.jsx)(GenericResourceUsage_1.GenericResourceUsageSkeleton, { title: t('Active_connections') });
    }
    const { current, max, percentage } = result.data;
    return (0, jsx_runtime_1.jsx)(GenericResourceUsage_1.GenericResourceUsage, { title: t('Active_connections'), value: current, max: max, percentage: percentage });
};
exports.default = CustomUserActiveConnections;
