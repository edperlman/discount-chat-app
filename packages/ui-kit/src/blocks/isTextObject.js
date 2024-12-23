"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextObject = void 0;
const TextObjectType_1 = require("./TextObjectType");
const isTextObject = (block) => Object.values(TextObjectType_1.TextObjectType).includes(block.type);
exports.isTextObject = isTextObject;
