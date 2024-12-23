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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ChatContext_1 = require("../contexts/ChatContext");
const ComposerBoxPopupPreview = (0, react_1.forwardRef)(function ComposerBoxPopupPreview({ focused, items, rid, tmid, select, suspended }, ref) {
    const id = (0, fuselage_hooks_1.useUniqueId)();
    const chat = (0, ChatContext_1.useChat)();
    const executeSlashCommandPreviewMethod = (0, ui_contexts_1.useMethod)('executeSlashCommandPreview');
    (0, react_1.useImperativeHandle)(ref, () => (Object.assign({ getFilter: () => {
            var _a, _b;
            const value = (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.substring(0, (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.selection.start);
            if (!value) {
                throw new Error('No value');
            }
            const matches = value.match(/(\/[\w\d\S]+ )([^]*)$/);
            if (!matches) {
                throw new Error('No matches');
            }
            const cmd = matches[1].replace('/', '').trim().toLowerCase();
            const params = matches[2];
            return { cmd, params, msg: { rid, tmid } };
        } }, (!suspended && {
        select: (item) => {
            var _a, _b, _c;
            const value = (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.substring(0, (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.selection.start);
            if (!value) {
                throw new Error('No value');
            }
            const matches = value.match(/(\/[\w\d\S]+ )([^]*)$/);
            if (!matches) {
                throw new Error('No matches');
            }
            const cmd = matches[1].replace('/', '').trim().toLowerCase();
            const params = matches[2];
            // TODO: Fix this solve the typing issue
            void executeSlashCommandPreviewMethod({ cmd, params, msg: { rid, tmid } }, { id: item._id, type: item.type, value: item.value });
            (_c = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _c === void 0 ? void 0 : _c.setText('');
        },
    }))), [chat === null || chat === void 0 ? void 0 : chat.composer, executeSlashCommandPreviewMethod, rid, tmid, suspended]);
    const itemsFlat = items
        .flatMap((item) => {
        if (item.isSuccess) {
            return item.data;
        }
        return [];
    })
        .sort((a, b) => (('sort' in a && a.sort) || 0) - (('sort' in b && b.sort) || 0));
    const isLoading = items.some((item) => item.isLoading && item.fetchStatus !== 'idle');
    (0, react_1.useEffect)(() => {
        if (focused) {
            const element = document.getElementById(`popup-item-${focused._id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [focused]);
    if (suspended) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'relative', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tile, { display: 'flex', padding: 8, role: 'menu', mbe: 8, "aria-labelledby": id, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { role: 'listbox', display: 'flex', overflow: 'auto', fontSize: 0, width: 0, flexGrow: 1, "aria-busy": isLoading, children: [isLoading &&
                        Array(5)
                            .fill(5)
                            .map((_, index) => (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', h: '100px', w: '120px', m: 2 }, index)), !isLoading &&
                        itemsFlat.map((item) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { onClick: () => select(item), role: 'option', className: ['popup-item', item === focused && 'selected'].filter(Boolean).join(' '), id: `popup-item-${item._id}`, bg: item === focused ? 'selected' : undefined, borderColor: item === focused ? 'highlight' : 'transparent', tabIndex: item === focused ? 0 : -1, "aria-selected": item === focused, m: 2, borderWidth: 'default', borderRadius: 'x4', children: [item.type === 'image' && (0, jsx_runtime_1.jsx)("img", { src: item.value, alt: item._id }), item.type === 'audio' && ((0, jsx_runtime_1.jsxs)("audio", { controls: true, children: [(0, jsx_runtime_1.jsx)("track", { kind: 'captions' }), (0, jsx_runtime_1.jsx)("source", { src: item.value }), "Your browser does not support the audio element."] })), item.type === 'video' && ((0, jsx_runtime_1.jsxs)("video", { controls: true, className: 'inline-video', children: [(0, jsx_runtime_1.jsx)("track", { kind: 'captions' }), (0, jsx_runtime_1.jsx)("source", { src: item.value }), "Your browser does not support the video element."] })), item.type === 'text' && (0, jsx_runtime_1.jsx)(fuselage_1.Option, { children: item.value }), item.type === 'other' && (0, jsx_runtime_1.jsx)("code", { children: item.value })] }, item._id)))] }) }) }));
});
exports.default = ComposerBoxPopupPreview;
