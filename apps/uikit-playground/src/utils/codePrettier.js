"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = __importDefault(require("prettier"));
const parser_babel_1 = __importDefault(require("prettier/parser-babel"));
const codePrettier = (code, cursor) => prettier_1.default.formatWithCursor(code, {
    parser: 'json',
    plugins: [parser_babel_1.default],
    tabWidth: 4,
    useTabs: true,
    singleQuote: false,
    cursorOffset: cursor,
});
exports.default = codePrettier;
