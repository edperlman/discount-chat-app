"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peggy_1 = __importDefault(require("peggy"));
function peggyLoader(grammarContent) {
    const options = Object.assign({ format: 'commonjs' }, this.getOptions());
    return peggy_1.default.generate(grammarContent, Object.assign({ output: 'source' }, options));
}
exports.default = peggyLoader;
