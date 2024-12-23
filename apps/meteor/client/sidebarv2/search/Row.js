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
const react_1 = __importStar(require("react"));
const UserItem_1 = __importDefault(require("./UserItem"));
const SidebarItemTemplateWithData_1 = __importDefault(require("../RoomList/SidebarItemTemplateWithData"));
const Row = ({ item, data }) => {
    const { t, SidebarItemTemplate, avatarTemplate: AvatarTemplate, useRealName, extended } = data;
    if (item.t === 'd' && !item.u) {
        return ((0, jsx_runtime_1.jsx)(UserItem_1.default, { id: `search-${item._id}`, useRealName: useRealName, t: t, item: item, SidebarItemTemplate: SidebarItemTemplate, AvatarTemplate: AvatarTemplate }));
    }
    return ((0, jsx_runtime_1.jsx)(SidebarItemTemplateWithData_1.default, { id: `search-${item._id}`, extended: extended, t: t, room: item, SidebarItemTemplate: SidebarItemTemplate, AvatarTemplate: AvatarTemplate }));
};
exports.default = (0, react_1.memo)(Row);
