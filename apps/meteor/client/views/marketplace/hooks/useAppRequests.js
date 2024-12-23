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
exports.useAppRequests = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useAppRequests = (appId, limit, offset, sort, filter) => {
    const fetchAppRequests = (0, ui_contexts_1.useEndpoint)('GET', '/apps/app-request');
    return (0, react_query_1.useQuery)({
        queryKey: ['app-requests', appId, limit, offset],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () { return fetchAppRequests({ appId, q: filter, sort, limit, offset }); }),
        cacheTime: 0,
    });
};
exports.useAppRequests = useAppRequests;
