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
const RoomHeader_1 = __importDefault(require("./RoomHeader"));
const E2EEState_1 = require("../../../../app/e2e/client/E2EEState");
const E2ERoomState_1 = require("../../../../app/e2e/client/E2ERoomState");
const useE2EERoomState_1 = require("../hooks/useE2EERoomState");
const useE2EEState_1 = require("../hooks/useE2EEState");
const RoomToolboxE2EESetup = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./RoomToolbox/RoomToolboxE2EESetup'))));
const RoomHeaderE2EESetup = ({ room, slots = {} }) => {
    const e2eeState = (0, useE2EEState_1.useE2EEState)();
    const e2eRoomState = (0, useE2EERoomState_1.useE2EERoomState)(room._id);
    if (e2eeState === E2EEState_1.E2EEState.SAVE_PASSWORD || e2eeState === E2EEState_1.E2EEState.ENTER_PASSWORD || e2eRoomState === E2ERoomState_1.E2ERoomState.WAITING_KEYS) {
        return (0, jsx_runtime_1.jsx)(RoomHeader_1.default, { room: room, slots: slots, roomToolbox: (0, jsx_runtime_1.jsx)(RoomToolboxE2EESetup, {}) });
    }
    return (0, jsx_runtime_1.jsx)(RoomHeader_1.default, { room: room, slots: slots });
};
exports.default = RoomHeaderE2EESetup;
