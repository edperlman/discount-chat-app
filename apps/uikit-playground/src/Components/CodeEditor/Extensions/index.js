"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lang_javascript_1 = require("@codemirror/lang-javascript");
const HighlightStyle_1 = __importDefault(require("./HighlightStyle"));
const basicSetup_1 = __importDefault(require("./basicSetup"));
const theme_1 = __importDefault(require("./theme"));
const extensions = [HighlightStyle_1.default, (0, lang_javascript_1.javascript)(), basicSetup_1.default, ...theme_1.default];
exports.default = extensions;
