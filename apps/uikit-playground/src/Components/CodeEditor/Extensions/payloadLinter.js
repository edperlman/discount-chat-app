"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = require("@codemirror/language");
const lint_1 = require("@codemirror/lint");
const Parser_1 = __importDefault(require("../Parser"));
const payloadLinter = (0, lint_1.linter)((view) => {
    const diagnostics = [];
    const tree = (0, language_1.syntaxTree)(view.state);
    let head = tree.topNode.firstChild;
    if (!head || !head.matchContext(['Script'])) {
        diagnostics.push({
            from: 0,
            to: 0,
            message: 'Expecting a Script',
            severity: 'error',
        });
        return diagnostics;
    }
    head = head.firstChild;
    if (!head || !head.matchContext(['ExpressionStatement'])) {
        diagnostics.push({
            from: 0,
            to: 0,
            message: 'Expecting an expression statement',
            severity: 'error',
        });
        return diagnostics;
    }
    head = head.firstChild;
    if (!head || !head.matchContext(['ArrayExpression'])) {
        diagnostics.push({
            from: 0,
            to: 0,
            message: 'Expecting an array expression',
            severity: 'error',
        });
        return diagnostics;
    }
    // while (head.nextSibling && head.nextSibling.name !== ']') {
    // }
    do {
        if (head.name !== '[' &&
            head.name !== ',' &&
            head.name !== ']' &&
            head.name !== 'ObjectExpression') {
            diagnostics.push({
                from: head.from,
                to: head.to,
                message: 'Expecting an Object expression',
                severity: 'error',
            });
            return diagnostics;
        }
        if (head.name === 'ObjectExpression')
            (0, Parser_1.default)(head, view);
        head = head.nextSibling;
    } while (head);
    return diagnostics;
});
exports.default = payloadLinter;
