"use strict";
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
exports.TriggerMessageContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_router_1 = require("preact-router");
const hooks_1 = require("preact/hooks");
const ScreenProvider_1 = require("../../components/Screen/ScreenProvider");
const canRenderMessage_1 = require("../../helpers/canRenderMessage");
const formatAgent_1 = require("../../helpers/formatAgent");
const parentCall_1 = require("../../lib/parentCall");
const store_1 = require("../../store");
const component_1 = __importDefault(require("./component"));
const TriggerMessageContainer = ({ ref }) => {
    const { messages, agent, unread } = (0, hooks_1.useContext)(store_1.StoreContext);
    const { theme, onRestore } = (0, hooks_1.useContext)(ScreenProvider_1.ScreenContext);
    const handleStart = () => __awaiter(void 0, void 0, void 0, function* () {
        (0, parentCall_1.parentCall)('setFullScreenDocumentMobile');
        (0, parentCall_1.parentCall)('openWidget');
        yield onRestore();
        (0, preact_router_1.route)('/');
    });
    (0, hooks_1.useEffect)(() => {
        (0, parentCall_1.parentCall)('resetDocumentStyle');
    }, []);
    return ((0, jsx_runtime_1.jsx)(component_1.default, { ref: ref, unread: unread, agent: (0, formatAgent_1.formatAgent)(agent), messages: messages === null || messages === void 0 ? void 0 : messages.filter(canRenderMessage_1.canRenderMessage), theme: theme, onStartChat: () => handleStart() }));
};
exports.TriggerMessageContainer = TriggerMessageContainer;
exports.default = exports.TriggerMessageContainer;
