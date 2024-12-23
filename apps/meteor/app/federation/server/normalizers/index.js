"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizers = void 0;
const message_1 = __importDefault(require("./message"));
const room_1 = __importDefault(require("./room"));
const subscription_1 = __importDefault(require("./subscription"));
const user_1 = __importDefault(require("./user"));
exports.normalizers = Object.assign(Object.assign(Object.assign(Object.assign({}, message_1.default), room_1.default), subscription_1.default), user_1.default);
