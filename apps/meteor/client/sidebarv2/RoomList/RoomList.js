"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const RoomListCollapser_1 = __importDefault(require("./RoomListCollapser"));
const RoomListRow_1 = __importDefault(require("./RoomListRow"));
const RoomListRowWrapper_1 = __importDefault(require("./RoomListRowWrapper"));
const RoomListWrapper_1 = __importDefault(require("./RoomListWrapper"));
const CustomScrollbars_1 = require("../../components/CustomScrollbars");
const RoomManager_1 = require("../../lib/RoomManager");
const useAvatarTemplate_1 = require("../hooks/useAvatarTemplate");
const useCollapsedGroups_1 = require("../hooks/useCollapsedGroups");
const usePreventDefault_1 = require("../hooks/usePreventDefault");
const useRoomList_1 = require("../hooks/useRoomList");
const useShortcutOpenMenu_1 = require("../hooks/useShortcutOpenMenu");
const useTemplateByViewMode_1 = require("../hooks/useTemplateByViewMode");
const RoomList = () => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAnonymous = !(0, ui_contexts_1.useUserId)();
    const { collapsedGroups, handleClick, handleKeyDown } = (0, useCollapsedGroups_1.useCollapsedGroups)();
    const { groupsCount, groupsList, roomList, groupedUnreadInfo } = (0, useRoomList_1.useRoomList)({ collapsedGroups });
    const avatarTemplate = (0, useAvatarTemplate_1.useAvatarTemplate)();
    const sideBarItemTemplate = (0, useTemplateByViewMode_1.useTemplateByViewMode)();
    const { ref } = (0, fuselage_hooks_1.useResizeObserver)({ debounceDelay: 100 });
    const openedRoom = (_a = (0, RoomManager_1.useOpenedRoom)()) !== null && _a !== void 0 ? _a : '';
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode') || 'extended';
    const extended = sidebarViewMode === 'extended';
    const itemData = (0, react_1.useMemo)(() => ({
        extended,
        t,
        SidebarItemTemplate: sideBarItemTemplate,
        AvatarTemplate: avatarTemplate,
        openedRoom,
        sidebarViewMode,
        isAnonymous,
    }), [avatarTemplate, extended, isAnonymous, openedRoom, sideBarItemTemplate, sidebarViewMode, t]);
    (0, usePreventDefault_1.usePreventDefault)(ref);
    (0, useShortcutOpenMenu_1.useShortcutOpenMenu)(ref);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'relative', display: 'flex', overflow: 'hidden', height: 'full', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', ref: ref, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.GroupedVirtuoso, Object.assign({ groupCounts: groupsCount, groupContent: (index) => ((0, jsx_runtime_1.jsx)(RoomListCollapser_1.default, { collapsedGroups: collapsedGroups, onClick: () => handleClick(groupsList[index]), onKeyDown: (e) => handleKeyDown(e, groupsList[index]), groupTitle: groupsList[index], unreadCount: groupedUnreadInfo[index] })) }, (roomList.length > 0 && {
            itemContent: (index) => roomList[index] && (0, jsx_runtime_1.jsx)(RoomListRow_1.default, { data: itemData, item: roomList[index] }),
        }), { components: { Item: RoomListRowWrapper_1.default, List: RoomListWrapper_1.default, Scroller: CustomScrollbars_1.VirtuosoScrollbars } })) }));
};
exports.default = RoomList;