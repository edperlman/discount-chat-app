"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPreviewExtensions = exports.actionBlockExtensions = void 0;
const lang_json_1 = require("@codemirror/lang-json");
const codemirror_1 = require("codemirror");
const HighlightStyle_1 = __importDefault(require("./HighlightStyle"));
const basicSetup_1 = __importDefault(require("./basicSetup"));
const jsonLinter_1 = __importDefault(require("./jsonLinter"));
// import payloadLinter from './payloadLinter';
const theme_1 = __importDefault(require("./theme"));
exports.actionBlockExtensions = [
    HighlightStyle_1.default,
    (0, lang_json_1.json)(),
    jsonLinter_1.default,
    basicSetup_1.default,
    // payloadLinter,
    ...theme_1.default,
];
exports.actionPreviewExtensions = [
    codemirror_1.EditorView.contentAttributes.of({ contenteditable: 'false' }),
    HighlightStyle_1.default,
    (0, lang_json_1.json)(),
    basicSetup_1.default,
    ...theme_1.default,
];
