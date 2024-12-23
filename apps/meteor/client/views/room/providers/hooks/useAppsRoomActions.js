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
exports.useAppsRoomActions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const UiKitTriggerTimeoutError_1 = require("../../../../../app/ui-message/client/UiKitTriggerTimeoutError");
const Utilities_1 = require("../../../../../ee/lib/misc/Utilities");
const useAppActionButtons_1 = require("../../../../hooks/useAppActionButtons");
const useApplyButtonFilters_1 = require("../../../../hooks/useApplyButtonFilters");
const useUiKitActionManager_1 = require("../../../../uikit/hooks/useUiKitActionManager");
const RoomContext_1 = require("../../contexts/RoomContext");
const useAppsRoomActions = () => {
    const result = (0, useAppActionButtons_1.useAppActionButtons)('roomAction');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const applyButtonFilters = (0, useApplyButtonFilters_1.useApplyButtonFilters)();
    const room = (0, RoomContext_1.useRoom)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_1.useMemo)(() => {
        var _a, _b;
        return (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.filter(applyButtonFilters).map((action) => ({
            id: action.actionId,
            icon: undefined,
            variant: action.variant,
            order: 300,
            title: Utilities_1.Utilities.getI18nKeyForApp(action.labelI18n, action.appId),
            groups: ['group', 'channel', 'live', 'team', 'direct', 'direct_multiple'],
            // Filters were applied in the applyButtonFilters function
            // if the code made it this far, the button should be shown
            action: () => {
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
        }))) !== null && _b !== void 0 ? _b : [];
    }, [actionManager, applyButtonFilters, dispatchToastMessage, result.data, room._id, t]);
};
exports.useAppsRoomActions = useAppsRoomActions;
