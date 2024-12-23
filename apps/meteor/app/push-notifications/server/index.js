"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotification = void 0;
require("./methods/saveNotificationSettings");
const PushNotification_1 = __importDefault(require("./lib/PushNotification"));
exports.PushNotification = PushNotification_1.default;
