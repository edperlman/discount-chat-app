"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppearancePage_1 = __importDefault(require("./AppearancePage"));
const Page_1 = require("../../../components/Page");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useAsyncState_1 = require("../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../hooks/useEndpointData");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const AppearancePageContainer = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { value: data, phase: state, error } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/appearance');
    const canViewAppearance = (0, ui_contexts_1.usePermission)('view-livechat-appearance');
    if (!canViewAppearance) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (state === useAsyncState_1.AsyncStatePhase.LOADING) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!(data === null || data === void 0 ? void 0 : data.appearance) || error) {
        return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Edit_Custom_Field') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Error') }) })] }));
    }
    return (0, jsx_runtime_1.jsx)(AppearancePage_1.default, { settings: data.appearance });
};
exports.default = AppearancePageContainer;
