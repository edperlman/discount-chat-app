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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRefreshStatistics = exports.useWorkspaceInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useWorkspaceInfo = ({ refreshStatistics } = {}) => {
    const getStatistics = (0, ui_contexts_1.useEndpoint)('GET', '/v1/statistics');
    const getInstances = (0, ui_contexts_1.useEndpoint)('GET', '/v1/instances.get');
    const getServerInfo = (0, ui_contexts_1.useEndpoint)('GET', '/info');
    return (0, react_query_1.useQueries)({
        queries: [
            {
                queryKey: ['info', 'serverInfo'],
                queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
                    const data = yield getServerInfo();
                    if (!('minimumClientVersions' in data)) {
                        throw new Error('Invalid server info');
                    }
                    if (!('info' in data)) {
                        throw new Error('Invalid server info');
                    }
                    if (!('version' in data)) {
                        throw new Error('Invalid server info');
                    }
                    return data;
                }),
                staleTime: Infinity,
                keepPreviousData: true,
            },
            {
                queryKey: ['info', 'instances'],
                queryFn: () => getInstances(),
                staleTime: Infinity,
                keepPreviousData: true,
                select({ instances }) {
                    return instances.map((instance) => (Object.assign(Object.assign({}, instance), (instance.instanceRecord && {
                        instanceRecord: Object.assign(Object.assign({}, instance.instanceRecord), { _createdAt: new Date(instance.instanceRecord._createdAt) }),
                    }))));
                },
            },
            {
                queryKey: ['info', 'statistics'],
                queryFn: () => getStatistics({ refresh: refreshStatistics ? 'true' : 'false' }),
                staleTime: Infinity,
                keepPreviousData: true,
                select: (data) => (Object.assign(Object.assign({}, data), { lastMessageSentAt: data.lastMessageSentAt ? new Date(data.lastMessageSentAt) : undefined })),
            },
        ],
    });
};
exports.useWorkspaceInfo = useWorkspaceInfo;
const useRefreshStatistics = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => queryClient.invalidateQueries(['info', 'statistics']),
    });
};
exports.useRefreshStatistics = useRefreshStatistics;
