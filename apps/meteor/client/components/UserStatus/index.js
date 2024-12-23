"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveUserStatus = exports.Loading = exports.Offline = exports.Online = exports.Away = exports.Busy = exports.UserStatus = exports.colors = void 0;
const ui_client_1 = require("@rocket.chat/ui-client");
exports.colors = ui_client_1.UserStatus.colors, exports.UserStatus = ui_client_1.UserStatus.UserStatus, exports.Busy = ui_client_1.UserStatus.Busy, exports.Away = ui_client_1.UserStatus.Away, exports.Online = ui_client_1.UserStatus.Online, exports.Offline = ui_client_1.UserStatus.Offline, exports.Loading = ui_client_1.UserStatus.Loading;
var ReactiveUserStatus_1 = require("./ReactiveUserStatus");
Object.defineProperty(exports, "ReactiveUserStatus", { enumerable: true, get: function () { return __importDefault(ReactiveUserStatus_1).default; } });
