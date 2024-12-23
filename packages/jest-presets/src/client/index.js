"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preset = '@rocket.chat/jest-presets/client';
exports.default = {
    preset,
    setupFilesAfterEnv: [`${preset}/jest-setup.js`],
};
