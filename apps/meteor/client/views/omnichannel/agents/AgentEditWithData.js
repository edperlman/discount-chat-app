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
const AgentEdit_1 = __importDefault(require("./AgentEdit"));
const Skeleton_1 = require("../../../components/Skeleton");
const AgentEditWithData = ({ uid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getAvailableDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department');
    const getAgentById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/users/agent/:_id', { _id: uid });
    const getAgentDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/agents/:agentId/departments', { agentId: uid });
    const { data, isLoading, error } = (0, react_query_1.useQuery)(['livechat-getAgentById', uid], () => __awaiter(void 0, void 0, void 0, function* () { return getAgentById(); }), { refetchOnWindowFocus: false });
    const { data: agentDepartments, isLoading: agentDepartmentsLoading, error: agentsDepartmentsError, } = (0, react_query_1.useQuery)(['livechat-getAgentDepartments', uid], () => __awaiter(void 0, void 0, void 0, function* () { return getAgentDepartments(); }), { refetchOnWindowFocus: false });
    const { data: availableDepartments, isLoading: availableDepartmentsLoading, error: availableDepartmentsError, } = (0, react_query_1.useQuery)(['livechat-getAvailableDepartments'], () => __awaiter(void 0, void 0, void 0, function* () { return getAvailableDepartments({ showArchived: 'true' }); }));
    if (isLoading || availableDepartmentsLoading || agentDepartmentsLoading || !agentDepartments || !availableDepartments) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (error || agentsDepartmentsError || availableDepartmentsError || !(data === null || data === void 0 ? void 0 : data.user)) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { p: 16, children: t('User_not_found') });
    }
    return ((0, jsx_runtime_1.jsx)(AgentEdit_1.default, { agentData: data.user, userDepartments: agentDepartments.departments, availableDepartments: availableDepartments.departments }));
};
exports.default = AgentEditWithData;
