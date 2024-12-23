"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOTR = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useReactiveValue_1 = require("./useReactiveValue");
const OTR_1 = __importDefault(require("../../app/otr/client/OTR"));
const OtrRoomState_1 = require("../../app/otr/lib/OtrRoomState");
const RoomContext_1 = require("../views/room/contexts/RoomContext");
const useOTR = () => {
    const uid = (0, ui_contexts_1.useUserId)();
    const room = (0, RoomContext_1.useRoom)();
    const otr = (0, react_1.useMemo)(() => {
        if (!uid || !room) {
            return;
        }
        return OTR_1.default.getInstanceByRoomId(uid, room._id);
    }, [uid, room]);
    const otrState = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => (otr ? otr.getState() : OtrRoomState_1.OtrRoomState.ERROR), [otr]));
    return {
        otr,
        otrState,
    };
};
exports.useOTR = useOTR;
