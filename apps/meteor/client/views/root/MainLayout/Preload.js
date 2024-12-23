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
const client_1 = require("../../../../app/models/client");
const client_2 = require("../../../../app/settings/client");
const client_3 = require("../../../../app/ui-utils/client");
const useReactiveVar_1 = require("../../../hooks/useReactiveVar");
const userData_1 = require("../../../lib/userData");
const PageLoading_1 = __importDefault(require("../PageLoading"));
const Preload = ({ children }) => {
    const uid = (0, ui_contexts_1.useUserId)();
    const subscriptionsReady = (0, useReactiveVar_1.useReactiveVar)(client_1.CachedChatSubscription.ready);
    const settingsReady = (0, useReactiveVar_1.useReactiveVar)(client_2.settings.cachedCollection.ready);
    const userDataReady = (0, useReactiveVar_1.useReactiveVar)(userData_1.isSyncReady);
    const ready = !uid || (userDataReady && subscriptionsReady && settingsReady);
    (0, react_1.useEffect)(() => {
        client_3.mainReady.set(ready);
    }, [ready]);
    if (!ready) {
        return (0, jsx_runtime_1.jsx)(PageLoading_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.default = Preload;
