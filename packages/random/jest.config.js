"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@rocket.chat/jest-presets/client"));
const server_1 = __importDefault(require("@rocket.chat/jest-presets/server"));
exports.default = {
    projects: [
        {
            displayName: 'client',
            preset: client_1.default.preset,
            testMatch: ['<rootDir>/src/**/*.client.spec.[jt]s?(x)'],
        },
        {
            displayName: 'server',
            preset: server_1.default.preset,
            testMatch: ['<rootDir>/src/**/*.server.spec.[jt]s?(x)'],
        },
    ],
};
