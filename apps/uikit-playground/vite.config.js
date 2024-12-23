"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)(() => ({
    base: './',
    esbuild: {},
    plugins: [(0, plugin_react_1.default)()],
    optimizeDeps: {
        include: ['@rocket.chat/ui-contexts', '@rocket.chat/message-parser', '@rocket.chat/core-typings'],
    },
    build: {
        commonjsOptions: {
            include: [/ui-contexts/, /core-typings/, /message-parser/, /node_modules/],
        },
    },
}));
