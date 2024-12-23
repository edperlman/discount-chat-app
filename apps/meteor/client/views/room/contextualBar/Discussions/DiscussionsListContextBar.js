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
const DiscussionsList_1 = __importDefault(require("./DiscussionsList"));
const useDiscussionsList_1 = require("./useDiscussionsList");
const useRecordList_1 = require("../../../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../../../hooks/useAsyncState");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const DiscussionListContextBar = () => {
    const userId = (0, ui_contexts_1.useUserId)();
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const [text, setText] = (0, react_1.useState)('');
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 400);
    const options = (0, react_1.useMemo)(() => ({
        rid: room._id,
        text: debouncedText,
    }), [room._id, debouncedText]);
    const { discussionsList, loadMoreItems } = (0, useDiscussionsList_1.useDiscussionsList)(options, userId);
    const { phase, error, items: discussions, itemCount: totalItemCount } = (0, useRecordList_1.useRecordList)(discussionsList);
    const handleTextChange = (0, react_1.useCallback)((e) => {
        setText(e.currentTarget.value);
    }, []);
    if (!userId) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(DiscussionsList_1.default, { onClose: closeTab, error: error, discussions: discussions, total: totalItemCount, loading: phase === useAsyncState_1.AsyncStatePhase.LOADING, loadMoreItems: loadMoreItems, text: text, onChangeFilter: handleTextChange }));
};
exports.default = DiscussionListContextBar;
