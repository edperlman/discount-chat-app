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
const LeaveTeamModalChannels_1 = __importDefault(require("./LeaveTeamModalChannels"));
const LeaveTeamModalConfirmation_1 = __importDefault(require("./LeaveTeamModalConfirmation"));
const LEAVE_TEAM_STEPS = {
    LIST_ROOMS: 'LIST_ROOMS',
    CONFIRM_LEAVE: 'CONFIRM_LEAVE',
};
const LeaveTeamModal = ({ rooms, onCancel, onConfirm }) => {
    const memoizedRooms = (0, react_1.useMemo)(() => rooms, [rooms]);
    const [step, setStep] = (0, react_1.useState)(memoizedRooms.length === 0 ? LEAVE_TEAM_STEPS.CONFIRM_LEAVE : LEAVE_TEAM_STEPS.LIST_ROOMS);
    const [selectedRooms, setSelectedRooms] = (0, react_1.useState)({});
    const lastOwnerRooms = rooms.filter(({ isLastOwner }) => isLastOwner);
    const handleContinue = (0, react_1.useCallback)(() => setStep(LEAVE_TEAM_STEPS.CONFIRM_LEAVE), []);
    const handleReturn = (0, react_1.useCallback)(() => setStep(LEAVE_TEAM_STEPS.LIST_ROOMS), []);
    const onChangeRoomSelection = (0, react_1.useCallback)((room) => {
        setSelectedRooms((selectedRooms) => {
            if (selectedRooms[room._id]) {
                delete selectedRooms[room._id];
                return Object.assign({}, selectedRooms);
            }
            return Object.assign(Object.assign({}, selectedRooms), { [room._id]: room });
        });
    }, []);
    const onToggleAllRooms = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setSelectedRooms((selectedRooms) => {
            if (Object.values(selectedRooms).filter(Boolean).length === 0) {
                return Object.fromEntries(rooms.filter(({ isLastOwner }) => !isLastOwner).map((room) => [room._id, room]));
            }
            return {};
        });
    });
    if (step === LEAVE_TEAM_STEPS.CONFIRM_LEAVE) {
        return ((0, jsx_runtime_1.jsx)(LeaveTeamModalConfirmation_1.default, { selectedRooms: selectedRooms, onConfirm: onConfirm, onClose: onCancel, onCancel: rooms.length > 0 ? handleReturn : undefined }));
    }
    return ((0, jsx_runtime_1.jsx)(LeaveTeamModalChannels_1.default, { rooms: rooms, onCancel: onCancel, eligibleRoomsLength: rooms.length - lastOwnerRooms.length, selectedRooms: selectedRooms, onToggleAllRooms: onToggleAllRooms, onConfirm: handleContinue, onChangeRoomSelection: onChangeRoomSelection }));
};
exports.default = LeaveTeamModal;
