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
exports.useUpdateChartData = useUpdateChartData;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const chartHandler_1 = require("../../../../../app/livechat/client/lib/chartHandler");
function useUpdateChartData({ context: contextRef, canvas: canvasRef, init, t, }) {
    return (0, fuselage_hooks_1.useEffectEvent)((label, data) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = (_a = contextRef.current) !== null && _a !== void 0 ? _a : (yield init(canvas, undefined, t));
        yield (0, chartHandler_1.updateChart)(context, label, data);
    }));
}
