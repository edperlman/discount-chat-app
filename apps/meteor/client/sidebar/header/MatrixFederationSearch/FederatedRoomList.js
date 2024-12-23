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
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_2 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const FederatedRoomListEmptyPlaceholder_1 = __importDefault(require("./FederatedRoomListEmptyPlaceholder"));
const FederatedRoomListItem_1 = __importDefault(require("./FederatedRoomListItem"));
const useInfiniteFederationSearchPublicRooms_1 = require("./useInfiniteFederationSearchPublicRooms");
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const FederatedRoomList = ({ serverName, roomName, count }) => {
    const joinExternalPublicRoom = (0, ui_contexts_1.useEndpoint)('POST', '/v1/federation/joinExternalPublicRoom');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data, isLoading, isFetchingNextPage, fetchNextPage } = (0, useInfiniteFederationSearchPublicRooms_1.useInfiniteFederationSearchPublicRooms)(serverName, roomName, count);
    const { mutate: onClickJoin, isLoading: isLoadingMutation } = (0, react_query_1.useMutation)(['federation/joinExternalPublicRoom'], (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, pageToken }) { return joinExternalPublicRoom({ externalRoomId: id, roomName, pageToken }); }), {
        onSuccess: (_, data) => {
            dispatchToastMessage({
                type: 'success',
                message: t('Your_request_to_join__roomName__has_been_made_it_could_take_up_to_15_minutes_to_be_processed', {
                    roomName: data.name,
                }),
            });
            setModal(null);
        },
        onError: (error, { id }) => {
            if (error instanceof Error && error.message === 'already-joined') {
                setModal(null);
                roomCoordinator_1.roomCoordinator.openRouteLink('c', { rid: id });
                return;
            }
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {});
    }
    const flattenedData = data === null || data === void 0 ? void 0 : data.pages.flatMap((page) => page.rooms);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'ul', overflow: 'hidden', height: '356px', flexGrow: 1, flexShrink: 0, mi: -24, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { data: flattenedData || [], computeItemKey: (index, room) => (room === null || room === void 0 ? void 0 : room.id) || index, overscan: 4, components: {
                // eslint-disable-next-line react/no-multi-comp
                Footer: () => (isFetchingNextPage ? (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {}) : null),
                Scroller: CustomScrollbars_1.VirtuosoScrollbars,
                EmptyPlaceholder: FederatedRoomListEmptyPlaceholder_1.default,
            }, endReached: isLoading || isFetchingNextPage ? () => undefined : () => fetchNextPage(), itemContent: (_, room) => ((0, react_1.createElement)(FederatedRoomListItem_1.default, Object.assign({ onClickJoin: () => onClickJoin(room) }, room, { disabled: isLoadingMutation, key: room.id }))) }) }));
};
exports.default = FederatedRoomList;
