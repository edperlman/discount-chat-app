"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("@rocket.chat/jest-presets/server"));
exports.default = {
    preset: server_1.default.preset,
    testMatch: ['<rootDir>/src/**/*.spec.(ts|js|mjs)'],
};
