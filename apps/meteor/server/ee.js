"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEEBroker = exports.startLicense = void 0;
var startup_1 = require("../ee/app/license/server/startup");
Object.defineProperty(exports, "startLicense", { enumerable: true, get: function () { return startup_1.startLicense; } });
var server_1 = require("../ee/server");
Object.defineProperty(exports, "registerEEBroker", { enumerable: true, get: function () { return server_1.registerEEBroker; } });
