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
const EditBusinessHours_1 = __importDefault(require("./EditBusinessHours"));
const Page_1 = require("../../../components/Page");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const EditBusinessHoursWidthData = ({ id, type }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const getBusinessHour = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/business-hour');
    const { data, isLoading, isError, refetch } = (0, react_query_1.useQuery)(['livechat-getBusinessHourById', id, type], () => __awaiter(void 0, void 0, void 0, function* () { return getBusinessHour({ _id: id, type }); }), {
        refetchOnWindowFocus: false,
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Business_Hours'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/businessHours'), children: t('Back') }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }) })] }));
    }
    return (0, jsx_runtime_1.jsx)(EditBusinessHours_1.default, { businessHourData: data.businessHour, type: type });
};
exports.default = EditBusinessHoursWidthData;
