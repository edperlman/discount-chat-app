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
exports.SelectedMessagesProvider = exports.selectedMessageStore = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const react_1 = __importStar(require("react"));
const SelectedMessagesContext_1 = require("../MessageList/contexts/SelectedMessagesContext");
// data-qa-select
exports.selectedMessageStore = new (class SelectMessageStore extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.store = new Set();
        this.isSelecting = false;
    }
    setIsSelecting(isSelecting) {
        this.isSelecting = isSelecting;
        this.emit('toggleIsSelecting', isSelecting);
    }
    getIsSelecting() {
        return this.isSelecting;
    }
    isSelected(mid) {
        return Boolean(this.store.has(mid));
    }
    getSelectedMessages() {
        return Array.from(this.store);
    }
    toggle(mid) {
        if (this.store.has(mid)) {
            this.store.delete(mid);
            this.emit(mid, false);
            this.emit('change');
            return;
        }
        this.store.add(mid);
        this.emit(mid, true);
        this.emit('change');
    }
    count() {
        return this.store.size;
    }
    clearStore() {
        const selectedMessages = this.getSelectedMessages();
        this.store.clear();
        selectedMessages.forEach((mid) => this.emit(mid, false));
        this.emit('change');
    }
    reset() {
        this.clearStore();
        this.isSelecting = false;
        this.emit('toggleIsSelecting', false);
    }
})();
const SelectedMessagesProvider = ({ children }) => {
    const value = (0, react_1.useMemo)(() => ({
        selectedMessageStore: exports.selectedMessageStore,
    }), []);
    return (0, jsx_runtime_1.jsx)(SelectedMessagesContext_1.SelectedMessageContext.Provider, { value: value, children: children });
};
exports.SelectedMessagesProvider = SelectedMessagesProvider;
