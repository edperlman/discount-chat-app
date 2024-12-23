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
exports.useExportMessagesRoomAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const ExportMessages = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../views/room/contextualBar/ExportMessages'))));
const useExportMessagesRoomAction = () => {
    const room = (0, RoomContext_1.useRoom)();
    const permitted = (0, ui_contexts_1.usePermission)('mail-messages', room._id);
    return (0, react_1.useMemo)(() => {
        if (!permitted) {
            return undefined;
        }
        return {
            id: 'export-messages',
            groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
            anonymous: true,
            title: 'Export_Messages',
            icon: 'mail',
            tabComponent: ExportMessages,
            full: true,
            order: 12,
            type: 'communication',
        };
    }, [permitted]);
};
exports.useExportMessagesRoomAction = useExportMessagesRoomAction;
