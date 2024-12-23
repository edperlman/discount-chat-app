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
const ThreadMetricsUnreadBadge_1 = __importDefault(require("./ThreadMetricsUnreadBadge"));
const useToggleFollowingThreadMutation_1 = require("../../../views/room/contextualBar/Threads/hooks/useToggleFollowingThreadMutation");
const ThreadMetricsFollow = ({ following, mid, rid, unread, mention, all }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const toggleFollowingThreadMutation = (0, useToggleFollowingThreadMutation_1.useToggleFollowingThreadMutation)({
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleFollow = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFollowingThreadMutation.mutate({ rid, tmid: mid, follow: !following });
    }, [following, rid, mid, toggleFollowingThreadMutation]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItem, { "data-rid": rid, children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsFollowing, { title: t(following ? 'Following' : 'Not_following'), name: following ? 'bell' : 'bell-off', onClick: handleFollow, badge: (0, jsx_runtime_1.jsx)(ThreadMetricsUnreadBadge_1.default, { unread: unread, mention: mention, all: all }) }) }));
};
exports.default = ThreadMetricsFollow;
