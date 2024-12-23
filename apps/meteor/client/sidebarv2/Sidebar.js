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
const RoomList_1 = __importDefault(require("./RoomList"));
const footer_1 = __importDefault(require("./footer"));
const SearchSection_1 = __importDefault(require("./header/SearchSection"));
const BannerSection_1 = __importDefault(require("./sections/BannerSection"));
const Sidebar = () => {
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    const sidebarHideAvatar = !(0, ui_contexts_1.useUserPreference)('sidebarDisplayAvatar');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.SidebarV2, { "aria-label": 'sidebar', className: ['rcx-sidebar--main', `rcx-sidebar rcx-sidebar--${sidebarViewMode}`, sidebarHideAvatar && 'rcx-sidebar--hide-avatar']
            .filter(Boolean)
            .join(' '), children: [(0, jsx_runtime_1.jsx)(SearchSection_1.default, {}), (0, jsx_runtime_1.jsx)(BannerSection_1.default, {}), (0, jsx_runtime_1.jsx)(RoomList_1.default, {}), (0, jsx_runtime_1.jsx)(footer_1.default, {})] }));
};
exports.default = (0, react_1.memo)(Sidebar);
