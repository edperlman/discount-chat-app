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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AppsList_1 = __importDefault(require("../AppsList"));
const FeaturedAppsSections_1 = __importDefault(require("./FeaturedAppsSections"));
const AppsPageContentBody = ({ isMarketplace, isFiltered, appsResult, itemsPerPage, current, onSetItemsPerPage, onSetCurrent, paginationProps, noErrorsOcurred, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const scrollableRef = (0, react_1.useRef)(null);
    const appsListId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', pi: 24, children: noErrorsOcurred && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { overflowY: 'scroll', height: '100%', ref: scrollableRef, children: [isMarketplace && !isFiltered && (0, jsx_runtime_1.jsx)(FeaturedAppsSections_1.default, { appsListId: appsListId, appsResult: (appsResult === null || appsResult === void 0 ? void 0 : appsResult.allApps) || [] }), (0, jsx_runtime_1.jsx)(AppsList_1.default, { appsListId: appsListId, apps: (appsResult === null || appsResult === void 0 ? void 0 : appsResult.items) || [], title: isMarketplace ? t('All_Apps') : undefined })] })) }), Boolean(appsResult === null || appsResult === void 0 ? void 0 : appsResult.count) && ((0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (appsResult === null || appsResult === void 0 ? void 0 : appsResult.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: (value) => {
                    var _a;
                    onSetCurrent(value);
                    (_a = scrollableRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, 0);
                }, bg: 'light' }, paginationProps)))] }));
};
exports.default = AppsPageContentBody;
