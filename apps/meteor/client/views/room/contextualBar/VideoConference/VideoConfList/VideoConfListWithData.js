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
const react_1 = __importStar(require("react"));
const VideoConfList_1 = __importDefault(require("./VideoConfList"));
const useVideoConfList_1 = require("./useVideoConfList");
const useRecordList_1 = require("../../../../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../../../../hooks/useAsyncState");
const RoomContext_1 = require("../../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../contexts/RoomToolboxContext");
const VideoConfListWithData = () => {
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const options = (0, react_1.useMemo)(() => ({ roomId: room._id }), [room._id]);
    const { reload, videoConfList, loadMoreItems } = (0, useVideoConfList_1.useVideoConfList)(options);
    const { phase, error, items: videoConfs, itemCount: totalItemCount } = (0, useRecordList_1.useRecordList)(videoConfList);
    return ((0, jsx_runtime_1.jsx)(VideoConfList_1.default, { onClose: closeTab, loadMoreItems: loadMoreItems, loading: phase === useAsyncState_1.AsyncStatePhase.LOADING, total: totalItemCount, error: error, reload: reload, videoConfs: videoConfs }));
};
exports.default = VideoConfListWithData;
