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
const CounterSet_1 = __importDefault(require("../../../components/dataView/CounterSet"));
const useOverviewData = () => {
    const getFederationOverviewData = (0, ui_contexts_1.useMethod)('federation:getOverviewData');
    const result = (0, react_query_1.useQuery)(['admin/federation-dashboard/overview'], () => __awaiter(void 0, void 0, void 0, function* () { return getFederationOverviewData(); }), {
        refetchInterval: 10000,
    });
    if (result.isLoading) {
        return [
            (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'text' }, 'event-count'),
            (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'text' }, 'user-count'),
            (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'text' }, 'server-count'),
        ];
    }
    if (result.isError) {
        return [
            (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'status-font-on-danger', children: "Error" }, 'event-count'),
            (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'status-font-on-danger', children: "Error" }, 'user-count'),
            (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'status-font-on-danger', children: "Error" }, 'server-count'),
        ];
    }
    const { data } = result.data;
    return [data[0].value, data[1].value, data[2].value];
};
function OverviewSection() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [eventCount, userCount, serverCount] = useOverviewData();
    return ((0, jsx_runtime_1.jsx)(CounterSet_1.default, { counters: [
            {
                count: eventCount,
                description: t('Number_of_events'),
            },
            {
                count: userCount,
                description: t('Number_of_federated_users'),
            },
            {
                count: serverCount,
                description: t('Number_of_federated_servers'),
            },
        ] }));
}
exports.default = OverviewSection;
