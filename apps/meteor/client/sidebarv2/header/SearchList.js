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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const CustomScrollbars_1 = require("../../components/CustomScrollbars");
const RoomListWrapper_1 = __importDefault(require("../RoomList/RoomListWrapper"));
const useAvatarTemplate_1 = require("../hooks/useAvatarTemplate");
const usePreventDefault_1 = require("../hooks/usePreventDefault");
const useTemplateByViewMode_1 = require("../hooks/useTemplateByViewMode");
const Row_1 = __importDefault(require("../search/Row"));
const useSearchItems_1 = require("./hooks/useSearchItems");
const SearchList = ({ filterText, onEscSearch, showRecentList }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const boxRef = (0, react_1.useRef)(null);
    (0, usePreventDefault_1.usePreventDefault)(boxRef);
    const { data: items = [], isLoading } = (0, useSearchItems_1.useSearchItems)(filterText);
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name');
    const sideBarItemTemplate = (0, useTemplateByViewMode_1.useTemplateByViewMode)();
    const avatarTemplate = (0, useAvatarTemplate_1.useAvatarTemplate)();
    const extended = sidebarViewMode === 'extended';
    const itemData = (0, react_1.useMemo)(() => ({
        items,
        t,
        SidebarItemTemplate: sideBarItemTemplate,
        avatarTemplate,
        useRealName,
        extended,
        sidebarViewMode,
    }), [avatarTemplate, extended, items, useRealName, sideBarItemTemplate, sidebarViewMode, t]);
    const handleClick = (e) => {
        var _a;
        if (e.target instanceof Element && [e.target.tagName, (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.tagName].includes('BUTTON')) {
            return;
        }
        return onEscSearch();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { ref: boxRef, role: 'listbox', tabIndex: -1, flexShrink: 1, h: 'full', w: 'full', pbs: showRecentList ? 0 : 8, "aria-live": 'polite', "aria-atomic": 'true', "aria-busy": isLoading, onClick: handleClick, children: [showRecentList && (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2GroupTitle, { title: t('Recent') }), (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: { height: '100%', width: '100%' }, totalCount: items.length, data: items, components: { List: RoomListWrapper_1.default, Scroller: CustomScrollbars_1.VirtuosoScrollbars }, computeItemKey: (_, room) => room._id, itemContent: (_, data) => (0, jsx_runtime_1.jsx)(Row_1.default, { data: itemData, item: data }) })] }));
};
exports.default = SearchList;
