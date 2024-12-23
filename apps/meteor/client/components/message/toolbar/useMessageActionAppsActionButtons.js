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
exports.useMessageActionAppsActionButtons = void 0;
const ui_1 = require("@rocket.chat/apps-engine/definition/ui");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const UiKitTriggerTimeoutError_1 = require("../../../../app/ui-message/client/UiKitTriggerTimeoutError");
const Utilities_1 = require("../../../../ee/lib/misc/Utilities");
const useAppActionButtons_1 = require("../../../hooks/useAppActionButtons");
const useApplyButtonFilters_1 = require("../../../hooks/useApplyButtonFilters");
const useUiKitActionManager_1 = require("../../../uikit/hooks/useUiKitActionManager");
const filterActionsByContext = (context, action) => {
    var _a;
    if (!context) {
        return true;
    }
    const messageActionContext = ((_a = action.when) === null || _a === void 0 ? void 0 : _a.messageActionContext) || Object.values(ui_1.MessageActionContext);
    const isContextMatch = messageActionContext.includes(context);
    return isContextMatch;
};
const useMessageActionAppsActionButtons = (message, context, category) => {
    const result = (0, useAppActionButtons_1.useAppActionButtons)('messageAction');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const applyButtonFilters = (0, useApplyButtonFilters_1.useApplyButtonFilters)(category);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const data = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.filter((action) => filterActionsByContext(context, action)).filter((action) => applyButtonFilters(action)).map((action) => {
            const item = {
                icon: undefined,
                id: (0, useAppActionButtons_1.getIdForActionButton)(action),
                label: Utilities_1.Utilities.getI18nKeyForApp(action.labelI18n, action.appId),
                order: 7,
                type: 'apps',
                variant: action.variant,
                group: 'menu',
                action: () => {
                    void actionManager
                        .emitInteraction(action.appId, {
                        type: 'actionButton',
                        rid: message.rid,
                        tmid: message.tmid,
                        mid: message._id,
                        actionId: action.actionId,
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
            };
            return item;
        });
    }, [actionManager, applyButtonFilters, context, dispatchToastMessage, message._id, message.rid, message.tmid, result.data, t]);
    return Object.assign(Object.assign({}, result), { data });
};
exports.useMessageActionAppsActionButtons = useMessageActionAppsActionButtons;
