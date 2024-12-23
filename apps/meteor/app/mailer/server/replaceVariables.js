"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceVariables = void 0;
const replaceVariables = (str, replacer) => str.replace(/\{ *([^\{\} ]+)[^\{\}]*\}/gim, replacer);
exports.replaceVariables = replaceVariables;
