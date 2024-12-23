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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const getURL_1 = require("../../app/utils/client/getURL");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const AvatarUrlProvider = ({ children }) => {
    const contextValue = (0, react_1.useMemo)(() => {
        function getUserPathAvatar(...args) {
            if (typeof args[0] === 'string') {
                const [username, etag] = args;
                return (0, getURL_1.getURL)(`/avatar/${username}${etag ? `?etag=${etag}` : ''}`);
            }
            const [params] = args;
            if ('userId' in params) {
                const { userId, etag } = params;
                return (0, getURL_1.getURL)(`/avatar/uid/${userId}${etag ? `?etag=${etag}` : ''}`);
            }
            const { username, etag } = params;
            return (0, getURL_1.getURL)(`/avatar/${username}${etag ? `?etag=${etag}` : ''}`);
        }
        return {
            getUserPathAvatar,
            getRoomPathAvatar: (_a) => {
                var { type } = _a, room = __rest(_a, ["type"]);
                return roomCoordinator_1.roomCoordinator.getRoomDirectives(type || room.t).getAvatarPath(Object.assign({ username: room._id }, room)) || '';
            },
        };
    }, []);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.AvatarUrlContext.Provider, { children: children, value: contextValue });
};
exports.default = AvatarUrlProvider;
