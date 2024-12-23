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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const Header_1 = require("../../../../components/Header");
const RoomContext_1 = require("../../contexts/RoomContext");
const useToggleFavoriteMutation_1 = require("../../hooks/useToggleFavoriteMutation");
const Favorite = ({ room: { _id, f: favorite = false, t: type, name } }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const subscribed = (0, RoomContext_1.useUserIsSubscribed)();
    const isFavoritesEnabled = (0, ui_contexts_1.useSetting)('Favorite_Rooms', true) && ['c', 'p', 'd', 't'].includes(type);
    const { mutate: toggleFavorite } = (0, useToggleFavoriteMutation_1.useToggleFavoriteMutation)();
    const handleFavoriteClick = (0, fuselage_hooks_1.useEffectEvent)(() => {
        if (!isFavoritesEnabled) {
            return;
        }
        toggleFavorite({ roomId: _id, favorite: !favorite, roomName: name || '' });
    });
    const favoriteLabel = favorite ? `${t('Unfavorite')} ${name}` : `${t('Favorite')} ${name}`;
    if (!subscribed || !isFavoritesEnabled) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(Header_1.HeaderState, { title: favoriteLabel, icon: favorite ? 'star-filled' : 'star', onClick: handleFavoriteClick, color: favorite ? 'status-font-on-warning' : null, tiny: true }));
};
exports.default = (0, react_1.memo)(Favorite);
