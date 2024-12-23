"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxify = proxify;
const api_1 = require("../api");
function handler(namespace) {
    return {
        get: (_target, prop) => (...params) => api_1.api.call(`${namespace}.${prop}`, params),
    };
}
function proxify(namespace) {
    return new Proxy({}, handler(namespace));
}
