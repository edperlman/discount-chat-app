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
exports.WrapCannedResponseList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CannedResponseList_1 = __importDefault(require("./CannedResponseList"));
const useRecordList_1 = require("../../../../hooks/lists/useRecordList");
const useIsRoomOverMacLimit_1 = require("../../../../hooks/omnichannel/useIsRoomOverMacLimit");
const asyncState_1 = require("../../../../lib/asyncState");
const ChatContext_1 = require("../../../../views/room/contexts/ChatContext");
const RoomContext_1 = require("../../../../views/room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../../views/room/contexts/RoomToolboxContext");
const useCannedResponseFilterOptions_1 = require("../../../hooks/useCannedResponseFilterOptions");
const useCannedResponseList_1 = require("../../../hooks/useCannedResponseList");
const CreateCannedResponse_1 = __importDefault(require("../../modals/CreateCannedResponse"));
const WrapCannedResponseList = () => {
    var _a;
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const options = (0, useCannedResponseFilterOptions_1.useCannedResponseFilterOptions)();
    const [text, setText] = (0, react_1.useState)('');
    const [type, setType] = (0, fuselage_hooks_1.useLocalStorage)('canned-response-list-type', 'all');
    const isRoomOverMacLimit = (0, useIsRoomOverMacLimit_1.useIsRoomOverMacLimit)(room);
    const handleTextChange = (0, react_1.useCallback)((event) => {
        setText(event.currentTarget.value);
    }, []);
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 400);
    const { cannedList, loadMoreItems, reload } = (0, useCannedResponseList_1.useCannedResponseList)((0, react_1.useMemo)(() => ({ filter: debouncedText, type }), [debouncedText, type]));
    const { phase, items, itemCount } = (0, useRecordList_1.useRecordList)(cannedList);
    const onClickItem = (0, fuselage_hooks_1.useMutableCallback)((data) => {
        var _a;
        const { _id: context } = data;
        router.navigate({
            name: (_a = router.getRouteName()) !== null && _a !== void 0 ? _a : 'live',
            params: {
                id: room._id,
                tab: 'canned-responses',
                context,
            },
        });
    });
    const composer = (_a = (0, ChatContext_1.useChat)()) === null || _a === void 0 ? void 0 : _a.composer;
    const onClickUse = (e, text) => {
        e.preventDefault();
        e.stopPropagation();
        composer === null || composer === void 0 ? void 0 : composer.setText(text);
        composer === null || composer === void 0 ? void 0 : composer.focus();
    };
    const onClickCreate = () => {
        setModal((0, jsx_runtime_1.jsx)(CreateCannedResponse_1.default, { onClose: () => setModal(null), reloadCannedList: reload }));
    };
    return ((0, jsx_runtime_1.jsx)(CannedResponseList_1.default, { loadMoreItems: loadMoreItems, cannedItems: items, itemCount: itemCount, onClose: closeTab, loading: phase === asyncState_1.AsyncStatePhase.LOADING, options: options, text: text, setText: handleTextChange, type: type, setType: setType, isRoomOverMacLimit: isRoomOverMacLimit, onClickUse: onClickUse, onClickItem: onClickItem, onClickCreate: onClickCreate, reload: reload }));
};
exports.WrapCannedResponseList = WrapCannedResponseList;
exports.default = (0, react_1.memo)(exports.WrapCannedResponseList);
