"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTopic = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const client_1 = require("../../../../app/models/client");
const MarkdownText_1 = __importDefault(require("../../../components/MarkdownText"));
const usePresence_1 = require("../../../hooks/usePresence");
const useReactiveQuery_1 = require("../../../hooks/useReactiveQuery");
const RoomLeader_1 = __importDefault(require("../HeaderV2/RoomLeader"));
const useCanEditRoom_1 = require("../contextualBar/Info/hooks/useCanEditRoom");
const RoomTopic = ({ room, user }) => {
    var _a, _b, _c;
    const t = (0, ui_contexts_1.useTranslation)();
    const canEdit = (0, useCanEditRoom_1.useCanEditRoom)(room);
    const userId = (0, ui_contexts_1.useUserId)();
    const directUserId = (_a = room.uids) === null || _a === void 0 ? void 0 : _a.filter((uid) => uid !== userId).shift();
    const directUserData = (0, usePresence_1.usePresence)(directUserId);
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const router = (0, ui_contexts_1.useRouter)();
    const currentRoute = router.getLocationPathname();
    const href = (0, core_typings_1.isTeamRoom)(room) ? `${currentRoute}/team-info` : `${currentRoute}/channel-settings`;
    const { data: roomLeader } = (0, useReactiveQuery_1.useReactiveQuery)(['rooms', room._id, 'leader', { not: user === null || user === void 0 ? void 0 : user._id }], () => {
        const leaderRoomRole = client_1.RoomRoles.findOne({
            'rid': room._id,
            'roles': 'leader',
            'u._id': { $ne: user === null || user === void 0 ? void 0 : user._id },
        });
        if (!leaderRoomRole) {
            return null;
        }
        return Object.assign(Object.assign({}, leaderRoomRole.u), { name: useRealName ? leaderRoomRole.u.name || leaderRoomRole.u.username : leaderRoomRole.u.username });
    });
    const topic = room.t === 'd' && ((_c = (_b = room.uids) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) < 3 ? directUserData === null || directUserData === void 0 ? void 0 : directUserData.statusText : room.topic;
    if (!topic && !roomLeader)
        return null;
    return ((0, jsx_runtime_1.jsxs)(ui_client_1.RoomBanner, { className: 'rcx-header-section rcx-topic-section', role: 'note', children: [(0, jsx_runtime_1.jsx)(ui_client_1.RoomBannerContent, { children: roomLeader && !topic && canEdit ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', href: href, children: t('Add_topic') })) : ((0, jsx_runtime_1.jsx)(MarkdownText_1.default, { parseEmoji: true, variant: 'inlineWithoutBreaks', withTruncatedText: true, content: topic })) }), roomLeader && (0, jsx_runtime_1.jsx)(RoomLeader_1.default, Object.assign({}, roomLeader))] }));
};
exports.RoomTopic = RoomTopic;
