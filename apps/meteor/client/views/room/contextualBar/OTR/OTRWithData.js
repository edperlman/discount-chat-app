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
const OTR_1 = __importDefault(require("./OTR"));
const OtrRoomState_1 = require("../../../../../app/otr/lib/OtrRoomState");
const useOTR_1 = require("../../../../hooks/useOTR");
const usePresence_1 = require("../../../../hooks/usePresence");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const OTRWithData = () => {
    const { otr, otrState } = (0, useOTR_1.useOTR)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const peerUserPresence = (0, usePresence_1.usePresence)(otr === null || otr === void 0 ? void 0 : otr.getPeerId());
    const userStatus = peerUserPresence === null || peerUserPresence === void 0 ? void 0 : peerUserPresence.status;
    const peerUsername = peerUserPresence === null || peerUserPresence === void 0 ? void 0 : peerUserPresence.username;
    const isOnline = !['offline', 'loading'].includes(userStatus || '');
    const handleStart = () => {
        otr === null || otr === void 0 ? void 0 : otr.handshake();
    };
    const handleEnd = () => {
        otr === null || otr === void 0 ? void 0 : otr.end();
    };
    const handleReset = () => {
        otr === null || otr === void 0 ? void 0 : otr.reset();
        otr === null || otr === void 0 ? void 0 : otr.handshake(true);
    };
    (0, react_1.useEffect)(() => {
        if (otrState !== OtrRoomState_1.OtrRoomState.ESTABLISHING) {
            return;
        }
        const timeout = setTimeout(() => {
            otr === null || otr === void 0 ? void 0 : otr.setState(OtrRoomState_1.OtrRoomState.TIMEOUT);
        }, 10000);
        return () => {
            clearTimeout(timeout);
        };
    }, [otr, otrState]);
    return ((0, jsx_runtime_1.jsx)(OTR_1.default, { isOnline: isOnline, onClickClose: closeTab, onClickStart: handleStart, onClickEnd: handleEnd, onClickRefresh: handleReset, otrState: otrState, peerUsername: peerUsername }));
};
exports.default = OTRWithData;
