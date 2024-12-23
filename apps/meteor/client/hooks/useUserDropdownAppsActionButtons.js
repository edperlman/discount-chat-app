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
exports.useUserDropdownAppsActionButtons = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useAppActionButtons_1 = require("./useAppActionButtons");
const useApplyButtonFilters_1 = require("./useApplyButtonFilters");
const UiKitTriggerTimeoutError_1 = require("../../app/ui-message/client/UiKitTriggerTimeoutError");
const useUiKitActionManager_1 = require("../uikit/hooks/useUiKitActionManager");
const useUserDropdownAppsActionButtons = () => {
    const result = (0, useAppActionButtons_1.useAppActionButtons)('userDropdownAction');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const applyButtonFilters = (0, useApplyButtonFilters_1.useApplyButtonAuthFilter)();
    const data = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.filter((action) => applyButtonFilters(action)).map((action) => {
            return {
                id: `${action.appId}_${action.actionId}`,
                // icon: action.icon as GenericMenuItemProps['icon'],
                content: action.labelI18n,
                onClick: () => {
                    void actionManager
                        .emitInteraction(action.appId, {
                        type: 'actionButton',
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
        });
    }, [actionManager, applyButtonFilters, dispatchToastMessage, result.data, t]);
    return Object.assign(Object.assign({}, result), { data });
};
exports.useUserDropdownAppsActionButtons = useUserDropdownAppsActionButtons;
