"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = pick;
function pick(object, ...attributes) {
    return Object.assign({}, attributes.reduce((data, key) => (Object.assign(Object.assign({}, data), (key in object ? { [key]: object[key] } : {}))), {}));
}
