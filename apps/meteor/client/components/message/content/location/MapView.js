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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MapViewFallback_1 = __importDefault(require("./MapViewFallback"));
const MapViewImage_1 = __importDefault(require("./MapViewImage"));
const useAsyncImage_1 = require("./hooks/useAsyncImage");
const MapView = ({ latitude, longitude }) => {
    const googleMapsApiKey = (0, ui_contexts_1.useSetting)('MapView_GMapsAPIKey', '');
    const linkUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}`;
    const imageUrl = (0, useAsyncImage_1.useAsyncImage)(googleMapsApiKey
        ? `https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=250x250&markers=color:gray%7Clabel:%7C${latitude},${longitude}&key=${googleMapsApiKey}`
        : undefined);
    if (!linkUrl) {
        return null;
    }
    if (!imageUrl) {
        return (0, jsx_runtime_1.jsx)(MapViewFallback_1.default, { linkUrl: linkUrl });
    }
    return (0, jsx_runtime_1.jsx)(MapViewImage_1.default, { linkUrl: linkUrl, imageUrl: imageUrl });
};
exports.default = (0, react_1.memo)(MapView);
