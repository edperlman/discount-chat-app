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
exports.useAppsRoomStarActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UiKitTriggerTimeoutError_1 = require("../../../app/ui-message/client/UiKitTriggerTimeoutError");
const Utilities_1 = require("../../../ee/lib/misc/Utilities");
const useUiKitActionManager_1 = require("../../uikit/hooks/useUiKitActionManager");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useAppActionButtons_1 = require("../useAppActionButtons");
const useApplyButtonFilters_1 = require("../useApplyButtonFilters");
const useAppsRoomStarActions = () => {
    const result = (0, useAppActionButtons_1.useAppActionButtons)('roomAction');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const applyButtonFilters = (0, useApplyButtonFilters_1.useApplyButtonFilters)('ai');
    const room = (0, RoomContext_1.useRoom)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_1.useMemo)(() => {
        if (!result.data) {
            return undefined;
        }
        const filteredActions = result.data.filter(applyButtonFilters);
        if (filteredActions.length === 0) {
            return undefined;
        }
        return {
            id: 'ai-actions',
            title: 'AI_Actions',
            icon: 'stars',
            groups: ['group', 'channel', 'live', 'team', 'direct', 'direct_multiple'],
            featured: true,
            renderToolboxItem: ({ id, icon, title, disabled, className }) => ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { button: (0, jsx_runtime_1.jsx)(ui_client_1.HeaderToolbarAction, {}), title: title, disabled: disabled, items: filteredActions.map((action) => ({
                    id: action.actionId,
                    icon: undefined,
                    title: Utilities_1.Utilities.getI18nKeyForApp(action.labelI18n, action.appId),
                    content: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', children: t(`${Utilities_1.Utilities.getI18nKeyForApp(action.labelI18n, action.appId)}`) }),
                    variant: action.variant,
                    groups: ['group', 'channel', 'live', 'team', 'direct', 'direct_multiple'],
                    onClick: () => {
                        void actionManager
                            .emitInteraction(action.appId, {
                            type: 'actionButton',
                            actionId: action.actionId,
                            rid: room._id,
                            payload: { context: action.context },
                        })
                            .catch((reason) => __awaiter(void 0, void 0, void 0, function* () {
                            if (reason instanceof UiKitTriggerTimeoutError_1.UiKitTriggerTimeoutError) {
                                dispatchToastMessage({
                                    type: 'error',
                                    message: t('UIKit_Interaction_Timeout'),
                                });
                                return;
                            }
                            return reason;
                        }));
                    },
                    type: 'apps',
                })), className: className, placement: 'bottom-start', icon: icon }, id)),
        };
    }, [actionManager, applyButtonFilters, dispatchToastMessage, result.data, room._id, t]);
};
exports.useAppsRoomStarActions = useAppsRoomStarActions;
