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
exports.useNewUsers = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const periods_1 = require("../../../../components/dashboards/periods");
const useNewUsers = ({ period, utc }) => {
    const getNewUsers = (0, ui_contexts_1.useEndpoint)('GET', '/v1/engagement-dashboard/users/new-users');
    return (0, react_query_1.useQuery)(['admin/engagement-dashboard/users/new', { period, utc }], () => __awaiter(void 0, void 0, void 0, function* () {
        const { start, end } = (0, periods_1.getPeriodRange)(period, utc);
        const response = yield getNewUsers({
            start: start.toISOString(),
            end: end.toISOString(),
        });
        return response
            ? Object.assign(Object.assign({}, response), { start,
                end }) : undefined;
    }), {
        refetchInterval: 5 * 60 * 1000,
        useErrorBoundary: true,
    });
};
exports.useNewUsers = useNewUsers;
