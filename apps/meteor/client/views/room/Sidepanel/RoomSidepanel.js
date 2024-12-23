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
/* eslint-disable react/no-multi-comp */
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const RoomSidepanelListWrapper_1 = __importDefault(require("./RoomSidepanelListWrapper"));
const RoomSidepanelLoading_1 = __importDefault(require("./RoomSidepanelLoading"));
const SidepanelItem_1 = __importDefault(require("./SidepanelItem"));
const useTeamslistChildren_1 = require("./hooks/useTeamslistChildren");
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const useRoomInfoEndpoint_1 = require("../../../hooks/useRoomInfoEndpoint");
const RoomManager_1 = require("../../../lib/RoomManager");
const RoomSidepanel = () => {
    var _a;
    const parentRid = (0, RoomManager_1.useOpenedRoom)();
    const secondLevelOpenedRoom = (_a = (0, RoomManager_1.useSecondLevelOpenedRoom)()) !== null && _a !== void 0 ? _a : parentRid;
    if (!parentRid || !secondLevelOpenedRoom) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(RoomSidepanelWithData, { parentRid: parentRid, openedRoom: secondLevelOpenedRoom });
};
const RoomSidepanelWithData = ({ parentRid, openedRoom }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    const roomInfo = (0, useRoomInfoEndpoint_1.useRoomInfoEndpoint)(parentRid);
    const sidepanelItems = ((_c = (_b = (_a = roomInfo.data) === null || _a === void 0 ? void 0 : _a.room) === null || _b === void 0 ? void 0 : _b.sidepanel) === null || _c === void 0 ? void 0 : _c.items) || ((_f = (_e = (_d = roomInfo.data) === null || _d === void 0 ? void 0 : _d.parent) === null || _e === void 0 ? void 0 : _e.sidepanel) === null || _f === void 0 ? void 0 : _f.items);
    const result = (0, useTeamslistChildren_1.useTeamsListChildrenUpdate)(parentRid, !roomInfo.data ? null : (_g = roomInfo.data.room) === null || _g === void 0 ? void 0 : _g.teamId, 
    // eslint-disable-next-line no-nested-ternary
    !sidepanelItems ? null : (sidepanelItems === null || sidepanelItems === void 0 ? void 0 : sidepanelItems.length) === 1 ? sidepanelItems[0] : undefined);
    if (roomInfo.isSuccess && !((_h = roomInfo.data.room) === null || _h === void 0 ? void 0 : _h.sidepanel) && !((_j = roomInfo.data.parent) === null || _j === void 0 ? void 0 : _j.sidepanel)) {
        return null;
    }
    if (roomInfo.isLoading || (roomInfo.isSuccess && result.isLoading)) {
        return (0, jsx_runtime_1.jsx)(RoomSidepanelLoading_1.default, {});
    }
    if (!result.isSuccess || !roomInfo.isSuccess) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Sidepanel, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { pb: 8, h: 'full', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: result.data.length, data: result.data, components: { Item: fuselage_1.SidepanelListItem, List: RoomSidepanelListWrapper_1.default, Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_, data) => ((0, jsx_runtime_1.jsx)(SidepanelItem_1.default, { openedRoom: openedRoom, room: data, parentRid: parentRid, viewMode: sidebarViewMode })) }) }) }));
};
exports.default = (0, react_1.memo)(RoomSidepanel);
