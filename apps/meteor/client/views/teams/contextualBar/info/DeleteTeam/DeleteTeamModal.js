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
const DeleteTeamChannels_1 = __importDefault(require("./DeleteTeamChannels"));
const DeleteTeamConfirmation_1 = __importDefault(require("./DeleteTeamConfirmation"));
const STEPS = { LIST_ROOMS: 'LIST_ROOMS', CONFIRM_DELETE: 'CONFIRM_DELETE' };
const DeleteTeamModal = ({ onCancel, onConfirm, rooms }) => {
    const hasRooms = rooms && rooms.length > 0;
    const [step, setStep] = (0, react_1.useState)(hasRooms ? STEPS.LIST_ROOMS : STEPS.CONFIRM_DELETE);
    const [deletedRooms, setDeletedRooms] = (0, react_1.useState)({});
    const [keptRooms, setKeptRooms] = (0, react_1.useState)({});
    const onChangeRoomSelection = (0, fuselage_hooks_1.useMutableCallback)((room) => {
        if (deletedRooms[room._id]) {
            setDeletedRooms((deletedRooms) => {
                delete deletedRooms[room._id];
                return Object.assign({}, deletedRooms);
            });
            return;
        }
        setDeletedRooms((deletedRooms) => (Object.assign(Object.assign({}, deletedRooms), { [room._id]: room })));
    });
    const onToggleAllRooms = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (Object.values(deletedRooms).filter(Boolean).length === 0) {
            return setDeletedRooms(Object.fromEntries(rooms.map((room) => [room._id, room])));
        }
        setDeletedRooms({});
    });
    const onSelectRooms = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const keptRooms = Object.fromEntries(rooms.filter((room) => !deletedRooms[room._id]).map((room) => [room._id, room]));
        setKeptRooms(keptRooms);
        setStep(STEPS.CONFIRM_DELETE);
    });
    if (step === STEPS.CONFIRM_DELETE) {
        return ((0, jsx_runtime_1.jsx)(DeleteTeamConfirmation_1.default, { onConfirm: onConfirm, onReturn: hasRooms ? () => setStep(STEPS.LIST_ROOMS) : undefined, onCancel: onCancel, deletedRooms: deletedRooms, keptRooms: keptRooms }));
    }
    return ((0, jsx_runtime_1.jsx)(DeleteTeamChannels_1.default, { rooms: rooms, onCancel: onCancel, selectedRooms: deletedRooms, onToggleAllRooms: onToggleAllRooms, onConfirm: onSelectRooms, onChangeRoomSelection: onChangeRoomSelection }));
};
exports.default = DeleteTeamModal;
