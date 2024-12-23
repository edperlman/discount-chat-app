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
exports.useBannerContextValue = void 0;
const useUiKitActionManager_1 = require("./useUiKitActionManager");
const useBannerContextValue = ({ view, values }) => {
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    return {
        action: (_a) => __awaiter(void 0, [_a], void 0, function* ({ appId, viewId, actionId, blockId, value }) {
            if (!appId || !viewId) {
                return;
            }
            yield actionManager.emitInteraction(appId, {
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
            actionManager.disposeView(view.viewId);
        }),
        updateState: () => undefined,
        appId: view.appId,
        values,
    };
};
exports.useBannerContextValue = useBannerContextValue;
