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
const EditRoomInfo_1 = __importDefault(require("./EditRoomInfo"));
const RoomInfo_1 = __importDefault(require("./RoomInfo"));
const useCanEditRoom_1 = require("./hooks/useCanEditRoom");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const RoomInfoRouter = ({ onClickBack, onEnterRoom, resetState }) => {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const room = (0, RoomContext_1.useRoom)();
    const canEdit = (0, useCanEditRoom_1.useCanEditRoom)(room);
    const onClickEnterRoom = (0, fuselage_hooks_1.useMutableCallback)(() => onEnterRoom === null || onEnterRoom === void 0 ? void 0 : onEnterRoom(room));
    if (isEditing) {
        return (0, jsx_runtime_1.jsx)(EditRoomInfo_1.default, { onClickBack: () => setIsEditing(false) });
    }
    return ((0, jsx_runtime_1.jsx)(RoomInfo_1.default, Object.assign({ room: room, icon: room.t === 'p' ? 'lock' : 'hashtag', onClickBack: onClickBack, onClickEdit: canEdit ? () => setIsEditing(true) : undefined, onClickClose: closeTab }, (Boolean(onEnterRoom) && {
        onClickEnterRoom,
    }), { resetState: resetState })));
};
exports.default = RoomInfoRouter;
