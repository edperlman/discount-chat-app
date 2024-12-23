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
            setupFilesAfterEnv: [...client_1.default.setupFilesAfterEnv],
            testMatch: [
                '<rootDir>/client/**/**.spec.[jt]s?(x)',
                '<rootDir>/ee/client/**/**.spec.[jt]s?(x)',
                '<rootDir>/tests/unit/client/views/**/*.spec.{ts,tsx}',
                '<rootDir>/tests/unit/client/providers/**/*.spec.{ts,tsx}',
            ],
            moduleNameMapper: {
                '^react($|/.+)': '<rootDir>/node_modules/react$1',
                '^react-dom/client$': '<rootDir>/node_modules/react-dom$1',
                '^react-dom($|/.+)': '<rootDir>/node_modules/react-dom$1',
                '^react-i18next($|/.+)': '<rootDir>/node_modules/react-i18next$1',
                '^@tanstack/(.+)': '<rootDir>/node_modules/@tanstack/$1',
                '^meteor/(.*)': '<rootDir>/tests/mocks/client/meteor.ts',
            },
            coveragePathIgnorePatterns: ['<rootDir>/tests/'],
        },
        {
            displayName: 'server',
            preset: server_1.default.preset,
            testMatch: [
                '<rootDir>/app/livechat/server/business-hour/**/*.spec.ts?(x)',
                '<rootDir>/app/livechat/server/api/**/*.spec.ts',
                '<rootDir>/ee/app/authorization/server/validateUserRoles.spec.ts',
                '<rootDir>/ee/app/license/server/**/*.spec.ts',
                '<rootDir>/ee/server/patches/**/*.spec.ts',
                '<rootDir>/app/cloud/server/functions/supportedVersionsToken/**.spec.ts',
                '<rootDir>/app/utils/lib/**.spec.ts',
            ],
        },
    ],
};
