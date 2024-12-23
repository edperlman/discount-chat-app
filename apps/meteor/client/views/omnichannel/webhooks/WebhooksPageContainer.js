"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const WebhooksPage_1 = __importDefault(require("./WebhooksPage"));
const Page_1 = require("../../../components/Page");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const reduceSettings = (settings) => settings.reduce((acc, { _id, value }) => {
    acc = Object.assign(Object.assign({}, acc), { [_id]: value });
    return acc;
}, {});
const WebhooksPageContainer = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getIntegrationsSettings = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/integrations.settings');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['/v1/livechat/integrations.settings'], () => __awaiter(void 0, void 0, void 0, function* () {
        const { settings, success } = yield getIntegrationsSettings();
        return { settings: reduceSettings(settings), success };
    }));
    const canViewLivechatWebhooks = (0, ui_contexts_1.usePermission)('view-livechat-webhooks');
    if (!canViewLivechatWebhooks) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!(data === null || data === void 0 ? void 0 : data.success) || !(data === null || data === void 0 ? void 0 : data.settings) || isError) {
        return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Webhooks') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Error') }) })] }));
    }
    return (0, jsx_runtime_1.jsx)(WebhooksPage_1.default, { settings: data.settings });
};
exports.default = WebhooksPageContainer;
