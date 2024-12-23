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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const ChatContext_1 = require("../../views/room/contexts/ChatContext");
const useIsVisible_1 = require("../../views/room/hooks/useIsVisible");
const MessageToolbar = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./toolbar/MessageToolbar'))));
const MessageToolbarHolder = ({ message, context }) => {
    const chat = (0, ChatContext_1.useChat)();
    const [ref, isVisible] = (0, useIsVisible_1.useIsVisible)();
    const [isToolbarMenuOpen, setIsToolbarMenuOpen] = (0, react_1.useState)(false);
    const showToolbar = isVisible || isToolbarMenuOpen;
    const depsQueryResult = (0, react_query_1.useQuery)(['toolbox', message._id, context], () => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield (chat === null || chat === void 0 ? void 0 : chat.data.findRoom());
        const subscription = yield (chat === null || chat === void 0 ? void 0 : chat.data.findSubscription());
        return {
            room,
            subscription,
        };
    }), {
        enabled: showToolbar,
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageToolbarWrapper, { ref: ref, visible: isToolbarMenuOpen, children: showToolbar && depsQueryResult.isSuccess && depsQueryResult.data.room && ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: (0, jsx_runtime_1.jsx)(MessageToolbar, { message: message, messageContext: context, room: depsQueryResult.data.room, subscription: depsQueryResult.data.subscription, onChangeMenuVisibility: setIsToolbarMenuOpen }) })) }));
};
exports.default = (0, react_1.memo)(MessageToolbarHolder);
