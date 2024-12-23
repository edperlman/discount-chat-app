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
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const Header_1 = require("../../../components/Header");
const goToRoomById_1 = require("../../../lib/utils/goToRoomById");
const ParentTeam = ({ room }) => {
    var _a;
    const { teamId } = room;
    const userId = (0, ui_contexts_1.useUserId)();
    if (!teamId) {
        throw new Error('invalid rid');
    }
    if (!userId) {
        throw new Error('invalid uid');
    }
    const teamsInfoEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/teams.info');
    const userTeamsListEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.listTeams');
    const { data: teamInfoData, isLoading: teamInfoLoading, isError: teamInfoError, } = (0, react_query_1.useQuery)(['teamId', teamId], () => __awaiter(void 0, void 0, void 0, function* () { return teamsInfoEndpoint({ teamId }); }), {
        keepPreviousData: true,
        retry: (_, error) => (error === null || error === void 0 ? void 0 : error.error) === 'unauthorized' && false,
    });
    const { data: userTeams, isLoading: userTeamsLoading } = (0, react_query_1.useQuery)(['userId', userId], () => __awaiter(void 0, void 0, void 0, function* () { return userTeamsListEndpoint({ userId }); }));
    const userBelongsToTeam = ((_a = userTeams === null || userTeams === void 0 ? void 0 : userTeams.teams) === null || _a === void 0 ? void 0 : _a.find((team) => team._id === teamId)) || false;
    const isTeamPublic = (teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.type) === core_typings_1.TEAM_TYPE.PUBLIC;
    const redirectToMainRoom = () => {
        const rid = teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.roomId;
        if (!rid) {
            return;
        }
        if (!(isTeamPublic || userBelongsToTeam)) {
            return;
        }
        (0, goToRoomById_1.goToRoomById)(rid);
    };
    if (teamInfoLoading || userTeamsLoading) {
        return (0, jsx_runtime_1.jsx)(Header_1.HeaderTagSkeleton, {});
    }
    if (teamInfoError) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(Header_1.HeaderTag, { role: 'button', tabIndex: 0, onKeyDown: (e) => (e.code === 'Space' || e.code === 'Enter') && redirectToMainRoom(), onClick: redirectToMainRoom, children: [(0, jsx_runtime_1.jsx)(Header_1.HeaderTagIcon, { icon: { name: isTeamPublic ? 'team' : 'team-lock' } }), teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.name] }));
};
exports.default = ParentTeam;
