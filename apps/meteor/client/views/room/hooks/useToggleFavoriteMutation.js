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
exports.useToggleFavoriteMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const room_1 = require("../../../lib/mutationEffects/room");
const queryKeys_1 = require("../../../lib/queryKeys");
const useToggleFavoriteMutation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const toggleFavorite = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.favorite');
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)((_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, favorite }) {
        yield toggleFavorite({ roomId, favorite });
    }), {
        onMutate: ({ roomId, favorite }) => {
            queryClient.setQueryData(queryKeys_1.subscriptionsQueryKeys.subscription(roomId), (subscription) => subscription
                ? Object.assign(Object.assign({}, subscription), { f: favorite }) : undefined);
        },
        onSuccess: (_data, { roomId, favorite, roomName }) => {
            (0, room_1.toggleFavoriteRoom)(roomId, favorite);
            dispatchToastMessage({
                type: 'success',
                message: favorite
                    ? t('__roomName__was_added_to_favorites', { roomName })
                    : t('__roomName__was_removed_from_favorites', { roomName }),
            });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: (_data, _error, { roomId }) => {
            queryClient.invalidateQueries(queryKeys_1.subscriptionsQueryKeys.subscription(roomId));
        },
    });
};
exports.useToggleFavoriteMutation = useToggleFavoriteMutation;
