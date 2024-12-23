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
const node_util_1 = require("node:util");
const jest_axe_1 = require("jest-axe");
const uuid = __importStar(require("uuid"));
require("@testing-library/jest-dom");
expect.extend(jest_axe_1.toHaveNoViolations);
const urlByBlob = new WeakMap();
const blobByUrl = new Map();
globalThis.URL.createObjectURL = (blob) => {
    var _a;
    const url = (_a = urlByBlob.get(blob)) !== null && _a !== void 0 ? _a : `blob://${uuid.v4()}`;
    urlByBlob.set(blob, url);
    blobByUrl.set(url, blob);
    return url;
};
globalThis.URL.revokeObjectURL = (url) => {
    const blob = blobByUrl.get(url);
    if (!blob) {
        return;
    }
    urlByBlob.delete(blob);
    blobByUrl.delete(url);
};
globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
Object.defineProperty(global.navigator, 'serviceWorker', {
    value: {
        register: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    },
});
globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {
        this.root = null;
        this.rootMargin = '';
        this.thresholds = [];
    }
    disconnect() {
        return null;
    }
    observe() {
        return null;
    }
    takeRecords() {
        return [];
    }
    unobserve() {
        return null;
    }
};
globalThis.TextEncoder = node_util_1.TextEncoder;
globalThis.TextDecoder = node_util_1.TextDecoder;
