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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GameCenterInvitePlayersModal_1 = __importDefault(require("./GameCenterInvitePlayersModal"));
const Contextualbar_1 = require("../../components/Contextualbar");
const Skeleton_1 = require("../../components/Skeleton");
const GameCenterList = ({ handleClose, handleOpenGame, games, isLoading }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleInvitePlayer = (0, react_1.useCallback)((game) => {
        const handleClose = () => {
            setModal(null);
        };
        setModal(() => (0, jsx_runtime_1.jsx)(GameCenterInvitePlayersModal_1.default, { onClose: handleClose, game: game }));
    }, [setModal]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Apps_Game_Center') }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), !isLoading && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: games && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, {})] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableBody, { children: games.map((game, key) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { action: true, onKeyDown: () => handleOpenGame(game), onClick: () => handleOpenGame(game), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { url: game.icon }), " ", game.name] }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: game.description }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { onKeyDown: (e) => {
                                                    e.stopPropagation();
                                                    handleInvitePlayer(game);
                                                }, onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleInvitePlayer(game);
                                                }, name: 'plus', title: t('Apps_Game_Center_Invite_Friends') }) })] }, key))) })] }) })) })), isLoading && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {}) }))] }));
};
exports.default = GameCenterList;
