"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deasync = exports.deasyncPromise = void 0;
const deasync_1 = require("@kaciras/deasync");
Object.defineProperty(exports, "deasyncPromise", { enumerable: true, get: function () { return deasync_1.awaitSync; } });
Object.defineProperty(exports, "deasync", { enumerable: true, get: function () { return deasync_1.deasync; } });
