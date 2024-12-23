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
exports.useActiveConnections = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useActiveConnections = () => {
    const getConnections = (0, ui_contexts_1.useEndpoint)('GET', '/v1/presence.getConnections');
    return (0, react_query_1.useQuery)(['userConnections'], () => __awaiter(void 0, void 0, void 0, function* () {
        const { current, max } = yield getConnections();
        return { current, max, percentage: Math.min((current / max) * 100, 100) };
    }), { staleTime: 1000 * 60 });
};
exports.useActiveConnections = useActiveConnections;
