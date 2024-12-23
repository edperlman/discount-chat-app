"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const LeaveTeamModal_1 = __importDefault(require("./LeaveTeamModal/LeaveTeamModal"));
const GenericModalSkeleton_1 = __importDefault(require("../../../../../components/GenericModal/GenericModalSkeleton"));
const LeaveTeamWithData = ({ teamId, onCancel, onConfirm }) => {
    const userId = (0, ui_contexts_1.useUserId)();
    if (!userId) {
        throw Error('No user found');
    }
    const getRoomsOfUser = (0, ui_contexts_1.useEndpoint)('GET', '/v1/teams.listRoomsOfUser');
    const { data, isLoading } = (0, react_query_1.useQuery)(['teams.listRoomsOfUser'], () => getRoomsOfUser({ teamId, userId }));
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(GenericModalSkeleton_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(LeaveTeamModal_1.default, { onCancel: onCancel, onConfirm: onConfirm, rooms: (data === null || data === void 0 ? void 0 : data.rooms) || [] });
};
exports.default = LeaveTeamWithData;
