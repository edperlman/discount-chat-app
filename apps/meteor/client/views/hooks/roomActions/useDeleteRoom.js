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
exports.useDeleteRoom = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const DeleteTeam_1 = __importDefault(require("../../teams/contextualBar/info/DeleteTeam"));
const useDeleteRoom = (room, { reload } = {}) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    // eslint-disable-next-line no-nested-ternary
    const roomType = 'prid' in room ? 'discussion' : room.teamId && room.teamMain ? 'team' : 'channel';
    const isAdminRoute = router.getRouteName() === 'admin-rooms';
    const deleteRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.delete');
    const deleteTeamEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.delete');
    const teamsInfoEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/teams.info');
    const teamId = room.teamId || '';
    const { data: teamInfoData } = (0, react_query_1.useQuery)(['teamId', teamId], () => __awaiter(void 0, void 0, void 0, function* () { return teamsInfoEndpoint({ teamId }); }), {
        keepPreviousData: true,
        retry: false,
        enabled: room.teamId !== '',
    });
    const hasPermissionToDeleteRoom = (0, ui_contexts_1.usePermission)(`delete-${room.t}`, room._id);
    const hasPermissionToDeleteTeamRoom = (0, ui_contexts_1.usePermission)(`delete-team-${room.t === 'c' ? 'channel' : 'group'}`, teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.roomId);
    const isTeamRoom = room.teamId;
    const canDeleteRoom = (0, core_typings_1.isRoomFederated)(room) ? false : hasPermissionToDeleteRoom && (!isTeamRoom || hasPermissionToDeleteTeamRoom);
    const deleteRoomMutation = (0, react_query_1.useMutation)({
        mutationFn: deleteRoomEndpoint,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Deleted_roomType', { roomName: room.name, roomType }) });
            if (isAdminRoute) {
                return router.navigate('/admin/rooms');
            }
            return router.navigate('/home');
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            setModal(null);
            reload === null || reload === void 0 ? void 0 : reload();
        },
    });
    const deleteTeamMutation = (0, react_query_1.useMutation)({
        mutationFn: deleteTeamEndpoint,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Team_has_been_deleted') });
            if (isAdminRoute) {
                return router.navigate('/admin/rooms');
            }
            return router.navigate('/home');
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            setModal(null);
            reload === null || reload === void 0 ? void 0 : reload();
        },
    });
    const isDeleting = deleteTeamMutation.isLoading || deleteRoomMutation.isLoading;
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const handleDeleteTeam = (roomsToRemove) => __awaiter(void 0, void 0, void 0, function* () {
            if (!room.teamId) {
                return;
            }
            deleteTeamMutation.mutateAsync(Object.assign({ teamId: room.teamId }, (roomsToRemove.length && { roomsToRemove })));
        });
        if (room.teamMain && room.teamId) {
            return setModal((0, jsx_runtime_1.jsx)(DeleteTeam_1.default, { onConfirm: handleDeleteTeam, onCancel: () => setModal(null), teamId: room.teamId }));
        }
        const handleDeleteRoom = () => __awaiter(void 0, void 0, void 0, function* () {
            deleteRoomMutation.mutateAsync({ roomId: room._id });
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Delete_roomType', { roomType }), variant: 'danger', onConfirm: handleDeleteRoom, onCancel: () => setModal(null), confirmText: t('Yes_delete_it'), children: t('Delete_Room_Warning', { roomType }) }));
    });
    return { handleDelete, canDeleteRoom, isDeleting };
};
exports.useDeleteRoom = useDeleteRoom;
