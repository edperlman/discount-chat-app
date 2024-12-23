"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@rocket.chat/jest-presets/client"));
exports.default = {
    preset: client_1.default.preset,
    setupFilesAfterEnv: [...client_1.default.setupFilesAfterEnv],
    moduleNameMapper: {
        '^react($|/.+)': '<rootDir>/../../node_modules/react$1',
        '^react-dom/client$': '<rootDir>/../../node_modules/react-dom$1',
        '^react-dom($|/.+)': '<rootDir>/../../node_modules/react-dom$1',
    },
};
