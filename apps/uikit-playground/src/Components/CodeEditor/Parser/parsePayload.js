"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsePayload = (head, 
// Diagnostic: Diagnostic[],
view) => {
    const payload = JSON.parse(view.state.doc.toString().slice(head.from, head.to));
    payload && 1;
};
exports.default = parsePayload;
