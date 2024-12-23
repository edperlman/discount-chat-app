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
const BaseConvertToChannelModal_1 = __importDefault(require("./BaseConvertToChannelModal"));
const GenericModalSkeleton_1 = __importDefault(require("../../../components/GenericModal/GenericModalSkeleton"));
const useEndpointData_1 = require("../../../hooks/useEndpointData");
const asyncState_1 = require("../../../lib/asyncState");
const ConvertToChannelModal = ({ onClose, onCancel, onConfirm, teamId, userId }) => {
    const { value, phase } = (0, useEndpointData_1.useEndpointData)('/v1/teams.listRoomsOfUser', {
        params: (0, react_1.useMemo)(() => ({ teamId, userId, canUserDelete: 'true' }), [teamId, userId]),
    });
    if (phase === asyncState_1.AsyncStatePhase.LOADING) {
        return (0, jsx_runtime_1.jsx)(GenericModalSkeleton_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(BaseConvertToChannelModal_1.default, { onClose: onClose, onCancel: onCancel, onConfirm: onConfirm, rooms: value === null || value === void 0 ? void 0 : value.rooms });
};
exports.default = ConvertToChannelModal;
