"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overwriteSetting = void 0;
const overrideGenerator_1 = require("./overrideGenerator");
exports.overwriteSetting = (0, overrideGenerator_1.overrideGenerator)((key) => process.env[`OVERWRITE_SETTING_${key}`]);
