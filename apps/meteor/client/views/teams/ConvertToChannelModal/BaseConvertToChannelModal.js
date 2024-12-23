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
const FirstStep_1 = __importDefault(require("./ModalSteps/FirstStep"));
const SecondStep_1 = __importDefault(require("./ModalSteps/SecondStep"));
const STEPS = {
    LIST_ROOMS: 'LIST_ROOMS',
    CONFIRM_CONVERT: 'CONFIRM_CONVERT',
};
const BaseConvertToChannelModal = ({ onClose, onCancel, onConfirm, rooms, currentStep = (rooms === null || rooms === void 0 ? void 0 : rooms.length) === 0 ? STEPS.CONFIRM_CONVERT : STEPS.LIST_ROOMS, }) => {
    const [step, setStep] = (0, react_1.useState)(currentStep);
    const [selectedRooms, setSelectedRooms] = (0, react_1.useState)({});
    const onContinue = (0, fuselage_hooks_1.useMutableCallback)(() => setStep(STEPS.CONFIRM_CONVERT));
    const onReturn = (0, fuselage_hooks_1.useMutableCallback)(() => setStep(STEPS.LIST_ROOMS));
    const eligibleRooms = rooms;
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
        if (Object.values(selectedRooms).filter(Boolean).length === 0 && eligibleRooms) {
            return setSelectedRooms(Object.fromEntries(eligibleRooms.map((room) => [room._id, room])));
        }
        setSelectedRooms({});
    });
    if (step === STEPS.CONFIRM_CONVERT) {
        return ((0, jsx_runtime_1.jsx)(SecondStep_1.default, { onConfirm: onConfirm, onClose: onClose, onCancel: rooms && rooms.length > 0 ? onReturn : onCancel, deletedRooms: selectedRooms, rooms: rooms }));
    }
    return ((0, jsx_runtime_1.jsx)(FirstStep_1.default, { onConfirm: onContinue, onClose: onClose, onCancel: onCancel, rooms: rooms, selectedRooms: selectedRooms, onToggleAllRooms: onToggleAllRooms, onChangeRoomSelection: onChangeRoomSelection, eligibleRoomsLength: eligibleRooms === null || eligibleRooms === void 0 ? void 0 : eligibleRooms.length }));
};
exports.default = BaseConvertToChannelModal;
