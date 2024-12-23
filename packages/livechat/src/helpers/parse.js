"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const mem_1 = __importDefault(require("mem"));
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
};
const escapeRegex = new RegExp(`(?:${Object.keys(escapeMap).join('|')})`, 'g');
const escapeHtml = (0, mem_1.default)((string) => string.replace(escapeRegex, (match) => escapeMap[match]));
const parse = (plainText) => [{ plain: plainText }].map(({ plain }) => (plain ? escapeHtml(plain) : '')).join('');
exports.parse = parse;
