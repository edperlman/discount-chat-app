"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../store"));
class Commands {
    connected() {
        store_1.default.setState({ connecting: false });
    }
}
exports.default = Commands;
