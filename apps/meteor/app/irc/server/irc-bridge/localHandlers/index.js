"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateUser = exports.onSaveMessage = exports.onLogout = exports.onLogin = exports.onLeaveRoom = exports.onJoinRoom = exports.onCreateRoom = void 0;
const onCreateRoom_1 = __importDefault(require("./onCreateRoom"));
exports.onCreateRoom = onCreateRoom_1.default;
const onCreateUser_1 = __importDefault(require("./onCreateUser"));
exports.onCreateUser = onCreateUser_1.default;
const onJoinRoom_1 = __importDefault(require("./onJoinRoom"));
exports.onJoinRoom = onJoinRoom_1.default;
const onLeaveRoom_1 = __importDefault(require("./onLeaveRoom"));
exports.onLeaveRoom = onLeaveRoom_1.default;
const onLogin_1 = __importDefault(require("./onLogin"));
exports.onLogin = onLogin_1.default;
const onLogout_1 = __importDefault(require("./onLogout"));
exports.onLogout = onLogout_1.default;
const onSaveMessage_1 = __importDefault(require("./onSaveMessage"));
exports.onSaveMessage = onSaveMessage_1.default;
