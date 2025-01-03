"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const ReportCardContent_1 = require("./ReportCardContent");
const DownloadDataButton_1 = __importDefault(require("../../../components/dashboards/DownloadDataButton"));
const PeriodSelector_1 = __importDefault(require("../../../components/dashboards/PeriodSelector"));
exports.ReportCard = (0, react_1.forwardRef)(function ReportCard({ id, title, children, periodSelectorProps, downloadProps, isLoading, isDataFound, subtitle, emptyStateSubtitle, isError, onRetry }, ref) {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { h: 'full', ref: ref, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', "aria-busy": isLoading, "data-qa": id, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { "rcx-card__header": true, justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardCol, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'hint', fontScale: 'c1', "data-qa": 'report-summary', children: subtitle })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardCol, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.CardRow, { children: [(0, jsx_runtime_1.jsx)(PeriodSelector_1.default, Object.assign({ name: 'periodSelector' }, periodSelectorProps)), (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, Object.assign({}, downloadProps, { title: 'Download CSV', size: 32 }))] }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { flexDirection: 'column', height: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { h: 'full', display: 'flex', flexDirection: 'column', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(ReportCardContent_1.ReportCardContent, { isLoading: isLoading, isDataFound: isDataFound, isError: isError, onRetry: onRetry, subtitle: emptyStateSubtitle, children: children }) }) })] }) }));
});