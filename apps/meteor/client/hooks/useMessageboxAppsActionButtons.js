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
exports.useMessageboxAppsActionButtons = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useAppActionButtons_1 = require("./useAppActionButtons");
const useApplyButtonFilters_1 = require("./useApplyButtonFilters");
const UiKitTriggerTimeoutError_1 = require("../../app/ui-message/client/UiKitTriggerTimeoutError");
const Utilities_1 = require("../../ee/lib/misc/Utilities");
const useUiKitActionManager_1 = require("../uikit/hooks/useUiKitActionManager");
const useMessageboxAppsActionButtons = () => {
    const result = (0, useAppActionButtons_1.useAppActionButtons)('messageBoxAction');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const applyButtonFilters = (0, useApplyButtonFilters_1.useApplyButtonFilters)();
    const data = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = result.data) === null || _a === void 0 ? void 0 : _a.filter((action) => {
            return applyButtonFilters(action);
        }).map((action) => {
            const item = {
                id: (0, useAppActionButtons_1.getIdForActionButton)(action),
                label: Utilities_1.Utilities.getI18nKeyForApp(action.labelI18n, action.appId),
                action: (params) => {
                    var _a, _b;
                    void actionManager
                        .emitInteraction(action.appId, {
                        type: 'actionButton',
                        rid: params.rid,
                        tmid: params.tmid,
                        actionId: action.actionId,
                        payload: { context: action.context, message: (_b = (_a = params.chat.composer) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '' },
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
    }, [actionManager, applyButtonFilters, dispatchToastMessage, result.data, t]);
    return Object.assign(Object.assign({}, result), { data });
};
exports.useMessageboxAppsActionButtons = useMessageboxAppsActionButtons;
