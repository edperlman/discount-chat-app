"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleMenuAction = exports.GenericMenuItem = exports.GenericMenu = void 0;
var GenericMenu_1 = require("./GenericMenu");
Object.defineProperty(exports, "GenericMenu", { enumerable: true, get: function () { return __importDefault(GenericMenu_1).default; } });
var GenericMenuItem_1 = require("./GenericMenuItem");
Object.defineProperty(exports, "GenericMenuItem", { enumerable: true, get: function () { return __importDefault(GenericMenuItem_1).default; } });
var useHandleMenuAction_1 = require("./hooks/useHandleMenuAction");
Object.defineProperty(exports, "useHandleMenuAction", { enumerable: true, get: function () { return useHandleMenuAction_1.useHandleMenuAction; } });
