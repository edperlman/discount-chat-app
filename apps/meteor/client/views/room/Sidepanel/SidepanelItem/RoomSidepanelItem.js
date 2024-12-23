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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const goToRoomById_1 = require("../../../../lib/utils/goToRoomById");
const useTemplateByViewMode_1 = require("../../../../sidebarv2/hooks/useTemplateByViewMode");
const useItemData_1 = require("../hooks/useItemData");
const RoomSidepanelItem = ({ room, openedRoom, viewMode }) => {
    const SidepanelItem = (0, useTemplateByViewMode_1.useTemplateByViewMode)();
    const subscription = (0, ui_contexts_1.useUserSubscription)(room._id);
    const itemData = (0, useItemData_1.useItemData)(Object.assign(Object.assign({}, room), subscription), { viewMode, openedRoom }); // as any because of divergent and overlaping timestamp types in subs and room (type Date vs type string)
    if (!subscription) {
        return (0, jsx_runtime_1.jsx)(SidepanelItem, Object.assign({ onClick: goToRoomById_1.goToRoomById, is: 'a' }, itemData));
    }
    return (0, jsx_runtime_1.jsx)(SidepanelItem, Object.assign({ onClick: goToRoomById_1.goToRoomById }, itemData));
};
exports.default = (0, react_1.memo)(RoomSidepanelItem);
