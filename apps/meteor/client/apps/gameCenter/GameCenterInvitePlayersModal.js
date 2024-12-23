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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const UserAutoCompleteMultipleFederated_1 = __importDefault(require("../../components/UserAutoCompleteMultiple/UserAutoCompleteMultipleFederated"));
const RoomManager_1 = require("../../lib/RoomManager");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const callWithErrorHandling_1 = require("../../lib/utils/callWithErrorHandling");
const GameCenterInvitePlayersModal = ({ game, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [users, setUsers] = (0, react_1.useState)([]);
    const { name } = game;
    const openedRoom = (0, RoomManager_1.useOpenedRoom)();
    const sendInvite = () => __awaiter(void 0, void 0, void 0, function* () {
        const privateGroupName = `${name.replace(/\s/g, '-')}-${Random.id(10)}`;
        try {
            const result = yield (0, callWithErrorHandling_1.callWithErrorHandling)('createPrivateGroup', privateGroupName, users);
            roomCoordinator_1.roomCoordinator.openRouteLink(result.t, result);
            Tracker.autorun((c) => {
                if (openedRoom !== result.rid) {
                    return;
                }
                (0, callWithErrorHandling_1.callWithErrorHandling)('sendMessage', {
                    _id: Random.id(),
                    rid: result.rid,
                    msg: t('Apps_Game_Center_Play_Game_Together', { name }),
                });
                c.stop();
            });
            onClose();
        }
        catch (err) {
            console.warn(err);
        }
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(GenericModal_1.default, { onClose: onClose, onCancel: onClose, onConfirm: sendInvite, title: t('Apps_Game_Center_Invite_Friends'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, children: t('Invite_Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, display: 'flex', justifyContent: 'stretch', children: (0, jsx_runtime_1.jsx)(UserAutoCompleteMultipleFederated_1.default, { value: users, onChange: setUsers }) })] }) }));
};
exports.default = GameCenterInvitePlayersModal;
