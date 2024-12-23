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
const react_1 = __importStar(require("react"));
const useUserAvatarSuggestions_1 = require("./useUserAvatarSuggestions");
function UserAvatarSuggestions({ disabled, onSelectOne }) {
    const { data: suggestions = [] } = (0, useUserAvatarSuggestions_1.useUserAvatarSuggestions)();
    const handleClick = (0, react_1.useCallback)((suggestion) => () => onSelectOne === null || onSelectOne === void 0 ? void 0 : onSelectOne(suggestion), [onSelectOne]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: suggestions.map((suggestion) => suggestion.blob && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, disabled: disabled, mi: 4, onClick: handleClick(suggestion), children: (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { title: suggestion.service, url: suggestion.blob }) }, suggestion.service))) }));
}
exports.default = UserAvatarSuggestions;
