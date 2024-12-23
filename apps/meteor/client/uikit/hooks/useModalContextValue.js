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
exports.useModalContextValue = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useUiKitActionManager_1 = require("./useUiKitActionManager");
const useModalContextValue = ({ view, errors, values, updateValues }) => {
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const emitInteraction = (0, react_1.useMemo)(() => actionManager.emitInteraction.bind(actionManager), [actionManager]);
    const debouncedEmitInteraction = (0, fuselage_hooks_1.useDebouncedCallback)(emitInteraction, 700);
    return Object.assign(Object.assign({ action: (_a) => __awaiter(void 0, [_a], void 0, function* ({ actionId, viewId, appId, dispatchActionConfig, blockId, value }) {
            if (!appId || !viewId) {
                return;
            }
            const emit = (dispatchActionConfig === null || dispatchActionConfig === void 0 ? void 0 : dispatchActionConfig.includes('on_character_entered')) ? debouncedEmitInteraction : emitInteraction;
            yield emit(appId, {
                type: 'blockAction',
                actionId,
                container: {
                    type: 'view',
                    id: viewId,
                },
                payload: {
                    blockId,
                    value,
                },
            });
        }), updateState: ({ actionId, value, /* ,appId, */ blockId = 'default' }) => {
            updateValues({
                actionId,
                payload: {
                    blockId,
                    value,
                },
            });
        } }, view), { errors,
        values, viewId: view.id });
};
exports.useModalContextValue = useModalContextValue;
