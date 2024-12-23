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
const client_1 = require("../../../../app/ui-utils/client");
const RoomMessage_1 = __importDefault(require("../../../components/message/variants/RoomMessage"));
const SystemMessage_1 = __importDefault(require("../../../components/message/variants/SystemMessage"));
const useFormatDate_1 = require("../../../hooks/useFormatDate");
const isMessageNewDay_1 = require("../../room/MessageList/lib/isMessageNewDay");
const AuditMessageList = ({ messages }) => {
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const showUserAvatar = !!(0, ui_contexts_1.useUserPreference)('displayAvatars');
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: messages.map((message, index, { [index - 1]: previous }) => {
            const newDay = (0, isMessageNewDay_1.isMessageNewDay)(message, previous);
            const system = client_1.MessageTypes.isSystemMessage(message);
            return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [newDay && (0, jsx_runtime_1.jsx)(fuselage_1.MessageDivider, { children: formatDate(message.ts) }), !system && ((0, jsx_runtime_1.jsx)(RoomMessage_1.default, { message: message, sequential: false, unread: false, mention: false, all: false, ignoredUser: false, showUserAvatar: showUserAvatar })), system && (0, jsx_runtime_1.jsx)(SystemMessage_1.default, { message: message, showUserAvatar: showUserAvatar })] }, message._id));
        }) }));
};
exports.default = (0, react_1.memo)(AuditMessageList);
