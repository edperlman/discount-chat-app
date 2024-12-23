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
const react_1 = __importStar(require("react"));
const RoomFiles_1 = __importDefault(require("./RoomFiles"));
const useDeleteFile_1 = require("./hooks/useDeleteFile");
const useFilesList_1 = require("./hooks/useFilesList");
const useRecordList_1 = require("../../../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../../../hooks/useAsyncState");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const RoomFilesWithData = () => {
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const [text, setText] = (0, react_1.useState)('');
    const [type, setType] = (0, fuselage_hooks_1.useLocalStorage)('file-list-type', 'all');
    const handleTextChange = (0, react_1.useCallback)((event) => {
        setText(event.currentTarget.value);
    }, []);
    const query = (0, react_1.useMemo)(() => ({
        rid: room._id,
        type,
        text,
    }), [room._id, type, text]);
    const { filesList, loadMoreItems, reload } = (0, useFilesList_1.useFilesList)(query);
    const { phase, items: filesItems, itemCount: totalItemCount } = (0, useRecordList_1.useRecordList)(filesList);
    const handleDeleteFile = (0, useDeleteFile_1.useDeleteFile)(reload);
    return ((0, jsx_runtime_1.jsx)(RoomFiles_1.default, { loading: phase === useAsyncState_1.AsyncStatePhase.LOADING, type: type, text: text, filesItems: filesItems, loadMoreItems: loadMoreItems, setType: setType, setText: handleTextChange, total: totalItemCount, onClickClose: closeTab, onClickDelete: handleDeleteFile }));
};
exports.default = RoomFilesWithData;
