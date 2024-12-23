"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideSetting = void 0;
const overrideGenerator_1 = require("./overrideGenerator");
exports.overrideSetting = (0, overrideGenerator_1.overrideGenerator)((key) => process.env[key]);
