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
const react_1 = __importDefault(require("react"));
const shim_1 = require("use-sync-external-store/shim");
const LegacyBanner_1 = __importDefault(require("./LegacyBanner"));
const UiKitBanner_1 = __importDefault(require("./UiKitBanner"));
const useUserBanners_1 = require("./hooks/useUserBanners");
const withErrorBoundary_1 = require("../../components/withErrorBoundary");
const banners = __importStar(require("../../lib/banners"));
const BannerRegion = () => {
    const payload = (0, shim_1.useSyncExternalStore)(...banners.firstSubscription);
    (0, useUserBanners_1.useUserBanners)();
    if (!payload) {
        return null;
    }
    if (banners.isLegacyPayload(payload)) {
        return (0, jsx_runtime_1.jsx)(LegacyBanner_1.default, { config: payload });
    }
    return (0, jsx_runtime_1.jsx)(UiKitBanner_1.default, { initialView: payload }, payload.viewId);
};
exports.default = (0, withErrorBoundary_1.withErrorBoundary)(BannerRegion);
