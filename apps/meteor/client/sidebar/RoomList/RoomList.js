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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const RoomListRow_1 = __importDefault(require("./RoomListRow"));
const RoomListRowWrapper_1 = __importDefault(require("./RoomListRowWrapper"));
const RoomListWrapper_1 = __importDefault(require("./RoomListWrapper"));
const CustomScrollbars_1 = require("../../components/CustomScrollbars");
const RoomManager_1 = require("../../lib/RoomManager");
const useAvatarTemplate_1 = require("../hooks/useAvatarTemplate");
const usePreventDefault_1 = require("../hooks/usePreventDefault");
const useRoomList_1 = require("../hooks/useRoomList");
const useShortcutOpenMenu_1 = require("../hooks/useShortcutOpenMenu");
const useTemplateByViewMode_1 = require("../hooks/useTemplateByViewMode");
const computeItemKey = (index, room) => room._id || index;
const RoomList = () => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAnonymous = !(0, ui_contexts_1.useUserId)();
    const roomsList = (0, useRoomList_1.useRoomList)();
    const avatarTemplate = (0, useAvatarTemplate_1.useAvatarTemplate)();
    const sideBarItemTemplate = (0, useTemplateByViewMode_1.useTemplateByViewMode)();
    const { ref } = (0, fuselage_hooks_1.useResizeObserver)({ debounceDelay: 100 });
    const openedRoom = (_a = (0, RoomManager_1.useOpenedRoom)()) !== null && _a !== void 0 ? _a : '';
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode') || 'extended';
    const extended = sidebarViewMode === 'extended';
    const itemData = (0, react_1.useMemo)(() => ({
        extended,
        t,
        SideBarItemTemplate: sideBarItemTemplate,
        AvatarTemplate: avatarTemplate,
        openedRoom,
        sidebarViewMode,
        isAnonymous,
    }), [avatarTemplate, extended, isAnonymous, openedRoom, sideBarItemTemplate, sidebarViewMode, t]);
    (0, usePreventDefault_1.usePreventDefault)(ref);
    (0, useShortcutOpenMenu_1.useShortcutOpenMenu)(ref);
    const roomsListStyle = (0, css_in_js_1.css) `
		position: relative;

		display: flex;

		overflow-x: hidden;
		overflow-y: hidden;

		flex: 1 1 auto;

		height: 100%;

		&--embedded {
			margin-top: 2rem;
		}

		&__list:not(:last-child) {
			margin-bottom: 22px;
		}

		&__type {
			display: flex;

			flex-direction: row;

			padding: 0 var(--sidebar-default-padding) 1rem var(--sidebar-default-padding);

			color: var(--rooms-list-title-color);

			font-size: var(--rooms-list-title-text-size);
			align-items: center;
			justify-content: space-between;

			&-text--livechat {
				flex: 1;
			}
		}

		&__empty-room {
			padding: 0 var(--sidebar-default-padding);

			color: var(--rooms-list-empty-text-color);

			font-size: var(--rooms-list-empty-text-size);
		}

		&__toolbar-search {
			position: absolute;
			z-index: 10;
			left: 0;

			overflow-y: scroll;

			height: 100%;

			background-color: var(--sidebar-background);

			padding-block-start: 12px;
		}

		@media (max-width: 400px) {
			padding: 0 calc(var(--sidebar-small-default-padding) - 4px);

			&__type,
			&__empty-room {
				padding: 0 calc(var(--sidebar-small-default-padding) - 4px) 0.5rem calc(var(--sidebar-small-default-padding) - 4px);
			}
		}
	`;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: [roomsListStyle, 'sidebar--custom-colors'].filter(Boolean), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { h: 'full', w: 'full', ref: ref, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: roomsList.length, data: roomsList, components: { Item: RoomListRowWrapper_1.default, List: RoomListWrapper_1.default, Scroller: CustomScrollbars_1.VirtuosoScrollbars }, computeItemKey: computeItemKey, itemContent: (_, data) => (0, jsx_runtime_1.jsx)(RoomListRow_1.default, { data: itemData, item: data }) }) }) }));
};
exports.default = RoomList;
