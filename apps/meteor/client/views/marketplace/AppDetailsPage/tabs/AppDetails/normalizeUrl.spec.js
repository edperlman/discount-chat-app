"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const normalizeUrl_1 = require("./normalizeUrl");
globals_1.it.each([
    ['https://rocket.chat', 'https://rocket.chat'],
    ['//rocket.chat', 'https://rocket.chat'],
    ['rocket.chat', 'https://rocket.chat'],
    ['rocketchat@rocket.chat', 'mailto:rocketchat@rocket.chat'],
    ['plain_text', undefined],
])('should normalize %o as %o', (input, output) => {
    expect((0, normalizeUrl_1.normalizeUrl)(input)).toBe(output);
});
