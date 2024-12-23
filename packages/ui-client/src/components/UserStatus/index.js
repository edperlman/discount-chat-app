"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = exports.Offline = exports.Online = exports.Away = exports.Busy = exports.UserStatus = exports.colors = void 0;
exports.colors = {
    busy: 'danger-500',
    away: 'warning-600',
    online: 'success-500',
    offline: 'neutral-600',
};
var UserStatus_1 = require("./UserStatus");
Object.defineProperty(exports, "UserStatus", { enumerable: true, get: function () { return __importDefault(UserStatus_1).default; } });
var Busy_1 = require("./Busy");
Object.defineProperty(exports, "Busy", { enumerable: true, get: function () { return __importDefault(Busy_1).default; } });
var Away_1 = require("./Away");
Object.defineProperty(exports, "Away", { enumerable: true, get: function () { return __importDefault(Away_1).default; } });
var Online_1 = require("./Online");
Object.defineProperty(exports, "Online", { enumerable: true, get: function () { return __importDefault(Online_1).default; } });
var Offline_1 = require("./Offline");
Object.defineProperty(exports, "Offline", { enumerable: true, get: function () { return __importDefault(Offline_1).default; } });
var Loading_1 = require("./Loading");
Object.defineProperty(exports, "Loading", { enumerable: true, get: function () { return __importDefault(Loading_1).default; } });
