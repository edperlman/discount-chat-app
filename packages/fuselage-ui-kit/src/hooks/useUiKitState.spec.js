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
const ui_kit_1 = require("@rocket.chat/ui-kit");
const react_1 = require("@testing-library/react");
const useUiKitState_1 = require("./useUiKitState");
describe('state function', () => {
    const context = ui_kit_1.BlockContext.NONE;
    it('should handle arrays', () => __awaiter(void 0, void 0, void 0, function* () {
        const element = {
            type: 'multi_static_select',
            placeholder: { type: 'plain_text', text: '' },
            options: [],
            initialValue: ['A', 'B'],
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
        };
        const { result } = (0, react_1.renderHook)(() => (0, useUiKitState_1.useUiKitState)(element, context), {
            legacyRoot: true,
        });
        yield (0, react_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            const [, state] = result.current;
            yield state({
                target: {
                    value: ['C', 'D'],
                },
            });
        }));
        expect(result.current[0].value).toEqual(['C', 'D']);
    }));
});
describe('action function', () => {
    const context = ui_kit_1.BlockContext.ACTION;
    it('should handle arrays', () => __awaiter(void 0, void 0, void 0, function* () {
        const element = {
            type: 'multi_static_select',
            placeholder: { type: 'plain_text', text: '' },
            options: [],
            initialValue: ['A', 'B'],
            appId: 'app-id',
            blockId: 'block-id',
            actionId: 'action-id',
        };
        const { result } = (0, react_1.renderHook)(() => (0, useUiKitState_1.useUiKitState)(element, context), {
            legacyRoot: true,
        });
        yield (0, react_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            const [, action] = result.current;
            yield action({
                target: {
                    value: ['C', 'D'],
                },
            });
        }));
        expect(result.current[0].value).toEqual(['C', 'D']);
    }));
});
