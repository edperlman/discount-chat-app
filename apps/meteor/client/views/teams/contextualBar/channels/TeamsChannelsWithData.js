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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const AddExistingModal_1 = __importDefault(require("./AddExistingModal"));
const TeamsChannels_1 = __importDefault(require("./TeamsChannels"));
const useTeamsChannelList_1 = require("./hooks/useTeamsChannelList");
const useRecordList_1 = require("../../../../hooks/lists/useRecordList");
const asyncState_1 = require("../../../../lib/asyncState");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const CreateChannel_1 = __importDefault(require("../../../../sidebar/header/CreateChannel"));
const RoomContext_1 = require("../../../room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../room/contexts/RoomToolboxContext");
const TeamsChannelsWithData = () => {
    const room = (0, RoomContext_1.useRoom)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const canAddExistingRoomToTeam = (0, ui_contexts_1.usePermission)('move-room-to-team', room._id);
    const canCreateRoomInTeam = (0, ui_contexts_1.useAtLeastOnePermission)(['create-team-channel', 'create-team-group'], room._id);
    const { teamId } = room;
    if (!teamId) {
        throw new Error('Invalid teamId');
    }
    const [type, setType] = (0, fuselage_hooks_1.useLocalStorage)('channels-list-type', 'all');
    const [text, setText] = (0, react_1.useState)('');
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 800);
    const { teamsChannelList, loadMoreItems, reload } = (0, useTeamsChannelList_1.useTeamsChannelList)((0, react_1.useMemo)(() => ({ teamId, text: debouncedText, type }), [teamId, debouncedText, type]));
    const { phase, items, itemCount: total } = (0, useRecordList_1.useRecordList)(teamsChannelList);
    const handleTextChange = (0, react_1.useCallback)((event) => {
        setText(event.currentTarget.value);
    }, []);
    const handleAddExisting = (0, fuselage_hooks_1.useEffectEvent)(() => {
        setModal((0, jsx_runtime_1.jsx)(AddExistingModal_1.default, { teamId: teamId, onClose: () => setModal(null), reload: reload }));
    });
    const handleCreateNew = (0, fuselage_hooks_1.useEffectEvent)(() => {
        setModal((0, jsx_runtime_1.jsx)(CreateChannel_1.default, { teamId: teamId, mainRoom: room, onClose: () => setModal(null), reload: reload }));
    });
    const goToRoom = (0, fuselage_hooks_1.useEffectEvent)((room) => {
        roomCoordinator_1.roomCoordinator.openRouteLink(room.t, room);
    });
    return ((0, jsx_runtime_1.jsx)(TeamsChannels_1.default, { loading: phase === asyncState_1.AsyncStatePhase.LOADING, mainRoom: room, type: type, text: text, setType: setType, setText: handleTextChange, channels: items, total: total, onClickClose: closeTab, onClickAddExisting: canAddExistingRoomToTeam && handleAddExisting, onClickCreateNew: canCreateRoomInTeam && handleCreateNew, onClickView: goToRoom, loadMoreItems: loadMoreItems, reload: reload }));
};
exports.default = TeamsChannelsWithData;
