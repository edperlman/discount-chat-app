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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ThreadListMessage_1 = __importDefault(require("./ThreadListMessage"));
const useDecryptedMessage_1 = require("../../../../../hooks/useDecryptedMessage");
const normalizeThreadMessage_1 = require("../../../../../lib/normalizeThreadMessage");
const ThreadListItem = ({ thread, unread, unreadUser, unreadGroup, onClick }) => {
    var _a, _b, _c, _d, _e;
    const uid = (_a = (0, ui_contexts_1.useUserId)()) !== null && _a !== void 0 ? _a : undefined;
    const decryptedMsg = (0, useDecryptedMessage_1.useDecryptedMessage)(thread);
    const msg = (0, normalizeThreadMessage_1.normalizeThreadMessage)(Object.assign(Object.assign({}, thread), { msg: decryptedMsg }));
    const { name = thread.u.username } = thread.u;
    const following = !!uid && ((_c = (_b = thread.replies) === null || _b === void 0 ? void 0 : _b.includes(uid)) !== null && _c !== void 0 ? _c : false);
    const showRealNames = (_d = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name')) !== null && _d !== void 0 ? _d : false;
    const handleListItemClick = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick(thread._id);
    }, [onClick, thread._id]);
    return ((0, jsx_runtime_1.jsx)(ThreadListMessage_1.default, { className: (0, css_in_js_1.css) `
				cursor: pointer;
				&:hover,
				&:focus {
					background: ${fuselage_1.Palette.surface['surface-hover']};
				}
				border-bottom: 1px solid ${fuselage_1.Palette.stroke['stroke-extra-light']} !important;
			`, tabIndex: 0, _id: thread._id, replies: (_e = thread.tcount) !== null && _e !== void 0 ? _e : 0, tlm: thread.tlm, ts: thread.ts, participants: thread.replies, name: showRealNames ? name : thread.u.username, username: thread.u.username, unread: unread.includes(thread._id), mention: unreadUser.includes(thread._id), all: unreadGroup.includes(thread._id), following: following, "data-id": thread._id, msg: msg !== null && msg !== void 0 ? msg : '', rid: thread.rid, onClick: handleListItemClick, emoji: thread === null || thread === void 0 ? void 0 : thread.emoji }));
};
exports.default = (0, react_1.memo)(ThreadListItem);
