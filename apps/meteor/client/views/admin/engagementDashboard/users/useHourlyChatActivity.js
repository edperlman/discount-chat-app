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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHourlyChatActivity = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const moment_1 = __importDefault(require("moment"));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useHourlyChatActivity = ({ displacement, utc }) => {
    const getHourlyChatActivity = (0, ui_contexts_1.useEndpoint)('GET', '/v1/engagement-dashboard/users/chat-busier/hourly-data');
    return (0, react_query_1.useQuery)(['admin/engagement-dashboard/users/hourly-chat-activity', { displacement, utc }], () => __awaiter(void 0, void 0, void 0, function* () {
        const day = (utc ? moment_1.default.utc().endOf('day') : (0, moment_1.default)().endOf('day')).subtract(displacement, 'days').toDate();
        const response = yield getHourlyChatActivity({
            start: day.toISOString(),
        });
        return response
            ? Object.assign(Object.assign({}, response), { day }) : undefined;
    }), {
        refetchInterval: 5 * 60 * 1000,
        useErrorBoundary: true,
    });
};
exports.useHourlyChatActivity = useHourlyChatActivity;
