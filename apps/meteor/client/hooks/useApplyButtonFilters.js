"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApplyButtonAuthFilter = exports.useApplyButtonFilters = void 0;
const ui_1 = require("@rocket.chat/apps-engine/definition/ui");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const RoomContext_1 = require("../views/room/contexts/RoomContext");
const enumToFilter = {
    [ui_1.RoomTypeFilter.PUBLIC_CHANNEL]: (room) => room.t === 'c',
    [ui_1.RoomTypeFilter.PRIVATE_CHANNEL]: (room) => room.t === 'p',
    [ui_1.RoomTypeFilter.PUBLIC_TEAM]: core_typings_1.isPublicTeamRoom,
    [ui_1.RoomTypeFilter.PRIVATE_TEAM]: core_typings_1.isPrivateTeamRoom,
    [ui_1.RoomTypeFilter.PUBLIC_DISCUSSION]: core_typings_1.isPublicDiscussion,
    [ui_1.RoomTypeFilter.PRIVATE_DISCUSSION]: core_typings_1.isPrivateDiscussion,
    [ui_1.RoomTypeFilter.DIRECT]: core_typings_1.isDirectMessageRoom,
    [ui_1.RoomTypeFilter.DIRECT_MULTIPLE]: core_typings_1.isMultipleDirectMessageRoom,
    [ui_1.RoomTypeFilter.LIVE_CHAT]: core_typings_1.isOmnichannelRoom,
};
const applyRoomFilter = (button, room) => {
    const { roomTypes } = button.when || {};
    return !roomTypes || roomTypes.some((filter) => { var _a; return (_a = enumToFilter[filter]) === null || _a === void 0 ? void 0 : _a.call(enumToFilter, room); });
};
const applyCategoryFilter = (button, category) => {
    const { category: buttonCategory } = button;
    if (category === 'default') {
        return !buttonCategory || buttonCategory === 'default';
    }
    return buttonCategory === category;
};
const useApplyButtonFilters = (category = 'default') => {
    const room = (0, RoomContext_1.useRoom)();
    if (!room) {
        throw new Error('useApplyButtonFilters must be used inside a room context');
    }
    const applyAuthFilter = (0, exports.useApplyButtonAuthFilter)();
    return (0, react_1.useCallback)((button) => applyAuthFilter(button) && (!room || applyRoomFilter(button, room)) && applyCategoryFilter(button, category), [applyAuthFilter, category, room]);
};
exports.useApplyButtonFilters = useApplyButtonFilters;
const useApplyButtonAuthFilter = () => {
    const uid = (0, ui_contexts_1.useUserId)();
    const { queryAllPermissions, queryAtLeastOnePermission, queryRole } = (0, react_1.useContext)(ui_contexts_1.AuthorizationContext);
    return (0, react_1.useCallback)((button, room) => {
        const { hasAllPermissions, hasOnePermission, hasAllRoles, hasOneRole } = button.when || {};
        const hasAllPermissionsResult = hasAllPermissions ? queryAllPermissions(hasAllPermissions)[1]() : true;
        const hasOnePermissionResult = hasOnePermission ? queryAtLeastOnePermission(hasOnePermission)[1]() : true;
        const hasAllRolesResult = hasAllRoles ? !!uid && hasAllRoles.every((role) => queryRole(role, room === null || room === void 0 ? void 0 : room._id)) : true;
        const hasOneRoleResult = hasOneRole ? !!uid && hasOneRole.some((role) => queryRole(role, room === null || room === void 0 ? void 0 : room._id)[1]()) : true;
        return hasAllPermissionsResult && hasOnePermissionResult && hasAllRolesResult && hasOneRoleResult;
    }, [queryAllPermissions, queryAtLeastOnePermission, queryRole, uid]);
};
exports.useApplyButtonAuthFilter = useApplyButtonAuthFilter;
