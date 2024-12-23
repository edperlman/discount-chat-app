"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lang_json_1 = require("@codemirror/lang-json");
const lint_1 = require("@codemirror/lint");
exports.default = [(0, lint_1.lintGutter)(), (0, lint_1.linter)((0, lang_json_1.jsonParseLinter)())];
