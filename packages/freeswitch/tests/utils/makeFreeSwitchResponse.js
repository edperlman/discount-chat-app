"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFreeSwitchResponse = void 0;
const makeFreeSwitchResponse = (lines) => ({
    _body: lines.map((columns) => columns.join('|')).join('\n'),
});
exports.makeFreeSwitchResponse = makeFreeSwitchResponse;
