"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onClientMessageReceived = void 0;
const transforms_1 = require("../../lib/transforms");
exports.onClientMessageReceived = (0, transforms_1.createAsyncTransformChain)();
