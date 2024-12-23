"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const createToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
exports.createToken = createToken;
