"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgStream = void 0;
const Notifications_1 = __importDefault(require("../../../notifications/server/lib/Notifications"));
exports.msgStream = Notifications_1.default.streamRoomMessage;
