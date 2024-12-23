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
exports.useMessageSearchQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const RoomContext_1 = require("../../../contexts/RoomContext");
const useMessageSearchQuery = ({ searchText, limit, globalSearch, }) => {
    var _a;
    const uid = (_a = (0, ui_contexts_1.useUserId)()) !== null && _a !== void 0 ? _a : undefined;
    const room = (0, RoomContext_1.useRoom)();
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const searchMessages = (0, ui_contexts_1.useMethod)('rocketchatSearch.search');
    return (0, react_query_1.useQuery)(['rooms', room._id, 'message-search', { uid, rid: room._id, searchText, limit, globalSearch }], () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const result = yield searchMessages(searchText, { uid, rid: room._id }, { limit, searchAll: globalSearch });
        return (_b = (_a = result.message) === null || _a === void 0 ? void 0 : _a.docs) !== null && _b !== void 0 ? _b : [];
    }), {
        keepPreviousData: true,
        onError: () => {
            dispatchToastMessage({
                type: 'error',
                message: t('Search_message_search_failed'),
            });
        },
    });
};
exports.useMessageSearchQuery = useMessageSearchQuery;
