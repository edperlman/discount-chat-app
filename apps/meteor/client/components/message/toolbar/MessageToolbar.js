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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const toolbar_1 = require("@react-aria/toolbar");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MessageToolbarActionMenu_1 = __importDefault(require("./MessageToolbarActionMenu"));
const MessageToolbarStarsActionMenu_1 = __importDefault(require("./MessageToolbarStarsActionMenu"));
const DefaultItems_1 = __importDefault(require("./items/DefaultItems"));
const DirectItems_1 = __importDefault(require("./items/DirectItems"));
const FederatedItems_1 = __importDefault(require("./items/FederatedItems"));
const MentionsItems_1 = __importDefault(require("./items/MentionsItems"));
const MobileItems_1 = __importDefault(require("./items/MobileItems"));
const PinnedItems_1 = __importDefault(require("./items/PinnedItems"));
const SearchItems_1 = __importDefault(require("./items/SearchItems"));
const StarredItems_1 = __importDefault(require("./items/StarredItems"));
const ThreadsItems_1 = __importDefault(require("./items/ThreadsItems"));
const VideoconfItems_1 = __importDefault(require("./items/VideoconfItems"));
const VideoconfThreadsItems_1 = __importDefault(require("./items/VideoconfThreadsItems"));
const getMessageContext = (message, room, context) => {
    if (context) {
        return context;
    }
    if ((0, core_typings_1.isVideoConfMessage)(message)) {
        return 'videoconf';
    }
    if ((0, core_typings_1.isRoomFederated)(room)) {
        return 'federated';
    }
    if ((0, core_typings_1.isThreadMessage)(message)) {
        return 'threads';
    }
    return 'message';
};
const itemsByContext = {
    'message': DefaultItems_1.default,
    'message-mobile': MobileItems_1.default,
    'threads': ThreadsItems_1.default,
    'videoconf': VideoconfItems_1.default,
    'videoconf-threads': VideoconfThreadsItems_1.default,
    'pinned': PinnedItems_1.default,
    'direct': DirectItems_1.default,
    'starred': StarredItems_1.default,
    'mentions': MentionsItems_1.default,
    'federated': FederatedItems_1.default,
    'search': SearchItems_1.default,
};
const MessageToolbar = (_a) => {
    var { message, messageContext, room, subscription, onChangeMenuVisibility } = _a, props = __rest(_a, ["message", "messageContext", "room", "subscription", "onChangeMenuVisibility"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const toolbarRef = (0, react_1.useRef)(null);
    const { toolbarProps } = (0, toolbar_1.useToolbar)(props, toolbarRef);
    const context = getMessageContext(message, room, messageContext);
    const MessageToolbarItems = itemsByContext[context];
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageToolbar, Object.assign({ ref: toolbarRef }, toolbarProps, { "aria-label": t('Message_actions') }, props, { children: [(0, jsx_runtime_1.jsx)(MessageToolbarItems, { message: message, room: room, subscription: subscription }), (0, jsx_runtime_1.jsx)(MessageToolbarStarsActionMenu_1.default, { message: message, context: context, onChangeMenuVisibility: onChangeMenuVisibility }), (0, jsx_runtime_1.jsx)(MessageToolbarActionMenu_1.default, { message: message, context: context, room: room, subscription: subscription, onChangeMenuVisibility: onChangeMenuVisibility })] })));
};
exports.default = (0, react_1.memo)(MessageToolbar);
