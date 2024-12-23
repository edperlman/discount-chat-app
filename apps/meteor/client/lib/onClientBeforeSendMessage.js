"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onClientBeforeSendMessage = void 0;
const transforms_1 = require("../../lib/transforms");
exports.onClientBeforeSendMessage = (0, transforms_1.createAsyncTransformChain)();
