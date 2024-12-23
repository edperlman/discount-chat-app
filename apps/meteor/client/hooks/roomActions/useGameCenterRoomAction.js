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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGameCenterRoomAction = void 0;
const react_1 = require("react");
const useExternalComponentsQuery_1 = require("../../apps/gameCenter/hooks/useExternalComponentsQuery");
const GameCenter = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../apps/gameCenter/GameCenter'))));
const useGameCenterRoomAction = () => {
    const result = (0, useExternalComponentsQuery_1.useExternalComponentsQuery)();
    const enabled = result.isSuccess && result.data.length > 0;
    return (0, react_1.useMemo)(() => {
        if (!enabled) {
            return undefined;
        }
        return {
            id: 'game-center',
            groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
            title: 'Apps_Game_Center',
            icon: 'game',
            tabComponent: GameCenter,
            order: -1,
        };
    }, [enabled]);
};
exports.useGameCenterRoomAction = useGameCenterRoomAction;
