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
exports.useAvatarTemplate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useAvatarTemplate = (sidebarViewMode, sidebarDisplayAvatar) => {
    const sidebarViewModeFromSettings = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    const sidebarDisplayAvatarFromSettings = (0, ui_contexts_1.useUserPreference)('sidebarDisplayAvatar');
    const viewMode = sidebarViewMode !== null && sidebarViewMode !== void 0 ? sidebarViewMode : sidebarViewModeFromSettings;
    const displayAvatar = sidebarDisplayAvatar !== null && sidebarDisplayAvatar !== void 0 ? sidebarDisplayAvatar : sidebarDisplayAvatarFromSettings;
    return (0, react_1.useMemo)(() => {
        if (!displayAvatar) {
            return null;
        }
        const size = (() => {
            switch (viewMode) {
                case 'extended':
                    return 'x36';
                case 'medium':
                    return 'x28';
                case 'condensed':
                default:
                    return 'x16';
            }
        })();
        const renderRoomAvatar = (room) => ((0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: size, room: Object.assign(Object.assign({}, room), { _id: room.rid || room._id, type: room.t }) }));
        return renderRoomAvatar;
    }, [displayAvatar, viewMode]);
};
exports.useAvatarTemplate = useAvatarTemplate;
