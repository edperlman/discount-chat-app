"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const getUniqueId = () => (0, uuid_1.v4)().slice(0, 8);
exports.default = getUniqueId;
