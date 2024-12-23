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
const GameCenterContainer_1 = __importDefault(require("./GameCenterContainer"));
const GameCenterList_1 = __importDefault(require("./GameCenterList"));
const useExternalComponentsQuery_1 = require("./hooks/useExternalComponentsQuery");
const preventSyntheticEvent_1 = require("../../lib/utils/preventSyntheticEvent");
const RoomToolboxContext_1 = require("../../views/room/contexts/RoomToolboxContext");
const GameCenter = () => {
    const [openedGame, setOpenedGame] = (0, react_1.useState)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const result = (0, useExternalComponentsQuery_1.useExternalComponentsQuery)();
    const handleClose = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
        closeTab();
    });
    const handleBack = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        setOpenedGame(undefined);
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!openedGame && ((0, jsx_runtime_1.jsx)(GameCenterList_1.default, { "data-testid": 'game-center-list', handleClose: handleClose, handleOpenGame: setOpenedGame, games: result.data, isLoading: result.isLoading })), openedGame && ((0, jsx_runtime_1.jsx)(GameCenterContainer_1.default, { "data-testid": 'game-center-container', handleBack: handleBack, handleClose: handleClose, game: openedGame }))] }));
};
exports.default = GameCenter;
