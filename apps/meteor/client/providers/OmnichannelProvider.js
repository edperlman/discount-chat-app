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
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const LivechatInquiry_1 = require("../../app/livechat/client/collections/LivechatInquiry");
const queueManager_1 = require("../../app/livechat/client/lib/stream/queueManager");
const inquiries_1 = require("../../app/livechat/lib/inquiries");
const KonchatNotification_1 = require("../../app/ui/client/lib/KonchatNotification");
const ClientLogger_1 = require("../../lib/ClientLogger");
const OmnichannelContext_1 = require("../contexts/OmnichannelContext");
const useHasLicenseModule_1 = require("../hooks/useHasLicenseModule");
const useReactiveValue_1 = require("../hooks/useReactiveValue");
const useShouldPreventAction_1 = require("../hooks/useShouldPreventAction");
const emptyContextValue = {
    inquiries: { enabled: false },
    enabled: false,
    isEnterprise: false,
    agentAvailable: false,
    showOmnichannelQueueLink: false,
    isOverMacLimit: false,
    livechatPriorities: {
        enabled: false,
        data: [],
        isLoading: false,
        isError: false,
    },
};
const OmnichannelProvider = ({ children }) => {
    const omniChannelEnabled = (0, ui_contexts_1.useSetting)('Livechat_enabled', true);
    const omnichannelRouting = (0, ui_contexts_1.useSetting)('Livechat_Routing_Method', 'Auto_Selection');
    const showOmnichannelQueueLink = (0, ui_contexts_1.useSetting)('Livechat_show_queue_list_link', false);
    const omnichannelPoolMaxIncoming = (0, ui_contexts_1.useSetting)('Livechat_guest_pool_max_number_incoming_livechats_displayed', 0);
    const omnichannelSortingMechanism = (0, ui_contexts_1.useSetting)('Omnichannel_sorting_mechanism', core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp);
    const loggerRef = (0, react_1.useRef)(new ClientLogger_1.ClientLogger('OmnichannelProvider'));
    const hasAccess = (0, ui_contexts_1.usePermission)('view-l-room');
    const canViewOmnichannelQueue = (0, ui_contexts_1.usePermission)('view-livechat-queue');
    const user = (0, ui_contexts_1.useUser)();
    const agentAvailable = (user === null || user === void 0 ? void 0 : user.statusLivechat) === 'available';
    const voipCallAvailable = true; // TODO: use backend check;
    const getRoutingConfig = (0, ui_contexts_1.useMethod)('livechat:getRoutingConfig');
    const [routeConfig, setRouteConfig] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(undefined));
    const [queueNotification, setQueueNotification] = (0, react_1.useState)(new Set());
    const accessible = hasAccess && omniChannelEnabled;
    const iceServersSetting = (0, ui_contexts_1.useSetting)('WebRTC_Servers');
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise') === true;
    const getPriorities = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/priorities');
    const subscribe = (0, ui_contexts_1.useStream)('notify-logged');
    const queryClient = (0, react_query_1.useQueryClient)();
    const isPrioritiesEnabled = isEnterprise && accessible;
    const enabled = accessible && !!user && !!routeConfig;
    const { data: { priorities = [] } = {}, isInitialLoading: isLoadingPriorities, isError: isErrorPriorities, } = (0, react_query_1.useQuery)(['/v1/livechat/priorities'], () => getPriorities({ sort: JSON.stringify({ sortItem: 1 }) }), {
        staleTime: Infinity,
        enabled: isPrioritiesEnabled,
    });
    const isOverMacLimit = (0, useShouldPreventAction_1.useShouldPreventAction)('monthlyActiveContacts');
    (0, react_1.useEffect)(() => {
        if (!isPrioritiesEnabled) {
            return;
        }
        return subscribe('omnichannel.priority-changed', () => {
            queryClient.invalidateQueries(['/v1/livechat/priorities']);
        });
    }, [isPrioritiesEnabled, queryClient, subscribe]);
    (0, react_1.useEffect)(() => {
        if (!accessible) {
            return;
        }
        const update = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const routeConfig = yield getRoutingConfig();
                setRouteConfig(routeConfig);
            }
            catch (error) {
                loggerRef.current.error(`update() error in routeConfig ${error}`);
            }
        });
        if (omnichannelRouting || !omnichannelRouting) {
            update();
        }
    }, [accessible, getRoutingConfig, iceServersSetting, omnichannelRouting, setRouteConfig, voipCallAvailable]);
    const manuallySelected = enabled && canViewOmnichannelQueue && !!routeConfig && routeConfig.showQueue && !routeConfig.autoAssignAgent && agentAvailable;
    const streamNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    (0, react_1.useEffect)(() => {
        if (!manuallySelected) {
            return;
        }
        const handleDepartmentAgentData = () => {
            (0, queueManager_1.initializeLivechatInquiryStream)(user === null || user === void 0 ? void 0 : user._id);
        };
        (0, queueManager_1.initializeLivechatInquiryStream)(user === null || user === void 0 ? void 0 : user._id);
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        return streamNotifyUser(`${user._id}/departmentAgentData`, handleDepartmentAgentData);
    }, [manuallySelected, streamNotifyUser, user === null || user === void 0 ? void 0 : user._id]);
    const queue = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        if (!manuallySelected) {
            return undefined;
        }
        return LivechatInquiry_1.LivechatInquiry.find({ status: core_typings_1.LivechatInquiryStatus.QUEUED }, {
            sort: (0, inquiries_1.getOmniChatSortQuery)(omnichannelSortingMechanism),
            limit: omnichannelPoolMaxIncoming,
        }).fetch();
    }, [manuallySelected, omnichannelPoolMaxIncoming, omnichannelSortingMechanism]));
    queue === null || queue === void 0 ? void 0 : queue.map(({ rid }) => {
        if (queueNotification.has(rid)) {
            return;
        }
        setQueueNotification((prev) => new Set([...prev, rid]));
        return KonchatNotification_1.KonchatNotification.newRoom(rid);
    });
    const contextValue = (0, react_1.useMemo)(() => {
        if (!enabled) {
            return emptyContextValue;
        }
        const livechatPriorities = {
            enabled: isPrioritiesEnabled,
            data: priorities,
            isLoading: isLoadingPriorities,
            isError: isErrorPriorities,
        };
        if (!manuallySelected) {
            return Object.assign(Object.assign({}, emptyContextValue), { enabled: true, isEnterprise,
                agentAvailable,
                voipCallAvailable,
                routeConfig,
                livechatPriorities,
                isOverMacLimit });
        }
        return Object.assign(Object.assign({}, emptyContextValue), { enabled: true, isEnterprise,
            agentAvailable,
            voipCallAvailable,
            routeConfig, inquiries: queue
                ? {
                    enabled: true,
                    queue,
                }
                : { enabled: false }, showOmnichannelQueueLink: showOmnichannelQueueLink && !!agentAvailable, livechatPriorities,
            isOverMacLimit });
    }, [
        enabled,
        isPrioritiesEnabled,
        priorities,
        isLoadingPriorities,
        isErrorPriorities,
        manuallySelected,
        isEnterprise,
        agentAvailable,
        voipCallAvailable,
        routeConfig,
        queue,
        showOmnichannelQueueLink,
        isOverMacLimit,
    ]);
    return (0, jsx_runtime_1.jsx)(OmnichannelContext_1.OmnichannelContext.Provider, { children: children, value: contextValue });
};
exports.default = (0, react_1.memo)(OmnichannelProvider);
