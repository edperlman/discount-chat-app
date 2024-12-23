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
exports.unhandledRejectionListener = unhandledRejectionListener;
exports.unhandledExceptionListener = unhandledExceptionListener;
exports.default = registerErrorListeners;
const Messenger = __importStar(require("./lib/messenger.ts"));
function unhandledRejectionListener(event) {
    event.preventDefault();
    const { type, reason } = event;
    Messenger.sendNotification({
        method: 'unhandledRejection',
        params: [
            {
                type,
                reason: reason instanceof Error ? reason.message : reason,
                timestamp: new Date(),
            },
        ],
    });
}
function unhandledExceptionListener(event) {
    event.preventDefault();
    const { type, message, filename, lineno, colno } = event;
    Messenger.sendNotification({
        method: 'uncaughtException',
        params: [{ type, message, filename, lineno, colno }],
    });
}
function registerErrorListeners() {
    addEventListener('unhandledrejection', unhandledRejectionListener);
    addEventListener('error', unhandledExceptionListener);
}
