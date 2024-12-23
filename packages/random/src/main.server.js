"use strict";
// We use cryptographically strong PRNGs (crypto.getRandomBytes())
// When using crypto.getRandomValues(), our primitive is hexString(),
// from which we construct fraction().
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const NodeRandomGenerator_1 = require("./NodeRandomGenerator");
exports.Random = new NodeRandomGenerator_1.NodeRandomGenerator();
