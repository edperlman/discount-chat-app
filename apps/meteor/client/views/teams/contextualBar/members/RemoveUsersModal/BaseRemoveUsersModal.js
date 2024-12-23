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
const RemoveUsersFirstStep_1 = __importDefault(require("./RemoveUsersFirstStep"));
const RemoveUsersSecondStep_1 = __importDefault(require("./RemoveUsersSecondStep"));
const STEPS = {
    LIST_ROOMS: 'LIST_ROOMS',
    CONFIRM_DELETE: 'CONFIRM_DELETE',
};
const BaseRemoveUsersModal = ({ onClose, onCancel, onConfirm, rooms, currentStep = (rooms === null || rooms === void 0 ? void 0 : rooms.length) === 0 ? STEPS.CONFIRM_DELETE : STEPS.LIST_ROOMS, username, }) => {
    var _a;
    const [step, setStep] = (0, react_1.useState)(currentStep);
    const [selectedRooms, setSelectedRooms] = (0, react_1.useState)({});
    const onContinue = (0, fuselage_hooks_1.useMutableCallback)(() => setStep(STEPS.CONFIRM_DELETE));
    const onReturn = (0, fuselage_hooks_1.useMutableCallback)(() => setStep(STEPS.LIST_ROOMS));
    const canViewUserRooms = (0, ui_contexts_1.usePermission)('view-all-team-channels');
    const eligibleRooms = rooms === null || rooms === void 0 ? void 0 : rooms.filter(({ isLastOwner }) => !isLastOwner);
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
        var _a;
        if (Object.values(selectedRooms).filter(Boolean).length === 0) {
            return setSelectedRooms(Object.fromEntries((_a = eligibleRooms === null || eligibleRooms === void 0 ? void 0 : eligibleRooms.map((room) => [room._id, room])) !== null && _a !== void 0 ? _a : []));
        }
        setSelectedRooms({});
    });
    if (step === STEPS.CONFIRM_DELETE || !canViewUserRooms) {
        return ((0, jsx_runtime_1.jsx)(RemoveUsersSecondStep_1.default, { onConfirm: onConfirm, onClose: onClose, onCancel: ((_a = rooms === null || rooms === void 0 ? void 0 : rooms.length) !== null && _a !== void 0 ? _a : 0) > 0 ? onReturn : onCancel, deletedRooms: selectedRooms, rooms: rooms, username: username }));
    }
    return ((0, jsx_runtime_1.jsx)(RemoveUsersFirstStep_1.default, { onConfirm: onContinue, onClose: onClose, onCancel: onCancel, rooms: rooms, selectedRooms: selectedRooms, onToggleAllRooms: onToggleAllRooms, onChangeRoomSelection: onChangeRoomSelection, eligibleRoomsLength: eligibleRooms === null || eligibleRooms === void 0 ? void 0 : eligibleRooms.length }));
};
exports.default = BaseRemoveUsersModal;
