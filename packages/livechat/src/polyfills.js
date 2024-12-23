"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("whatwg-fetch");
const css_vars_ponyfill_1 = __importDefault(require("css-vars-ponyfill"));
if (typeof window.CSS === 'undefined' || typeof CSS.supports !== 'function' || !CSS.supports('--foo: bar')) {
    (0, css_vars_ponyfill_1.default)();
}
