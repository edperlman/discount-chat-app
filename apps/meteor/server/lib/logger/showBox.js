"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showErrorBox = showErrorBox;
exports.showSuccessBox = showSuccessBox;
exports.showWarningBox = showWarningBox;
const colorette_1 = require("colorette");
const stringUtils_1 = require("../../../lib/utils/stringUtils");
// force enable colors on dev env
const colors = (0, colorette_1.createColors)({
    useColor: process.env.NODE_ENV !== 'production',
});
function showBox(title, message, color) {
    const msgLines = message.split('\n');
    const len = Math.max.apply(null, msgLines.map((line) => line.length));
    const topLine = `+--${'-'.repeat(len)}--+`;
    const separator = `|  ${' '.repeat(len)}  |`;
    const lines = [];
    lines.push(topLine);
    if (title) {
        lines.push(`|  ${(0, stringUtils_1.lrpad)(title, len)}  |`);
        lines.push(topLine);
    }
    lines.push(separator);
    [...lines, ...msgLines.map((line) => `|  ${line.padEnd(len)}  |`), separator, topLine].forEach((line) => console.log(color ? colors[color](line) : line));
}
function showErrorBox(title, message) {
    showBox(title, message, 'red');
}
function showSuccessBox(title, message) {
    showBox(title, message, 'green');
}
function showWarningBox(title, message) {
    showBox(title, message, 'magenta');
}
