"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCardContent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ReportCardEmptyState_1 = require("./ReportCardEmptyState");
const ReportCardErrorState_1 = require("./ReportCardErrorState");
const ReportCardLoadingState_1 = require("./ReportCardLoadingState");
const ReportCardContent = ({ isLoading, isError, isDataFound, subtitle, onRetry, children }) => {
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(ReportCardLoadingState_1.ReportCardLoadingState, {});
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(ReportCardErrorState_1.ReportCardErrorState, { onRetry: onRetry });
    }
    if (!isDataFound) {
        return (0, jsx_runtime_1.jsx)(ReportCardEmptyState_1.ReportCardEmptyState, { subtitle: subtitle });
    }
    return children;
};
exports.ReportCardContent = ReportCardContent;
