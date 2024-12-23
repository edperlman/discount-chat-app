"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipOngoingView = exports.VoipOutgoingView = exports.VoipIncomingView = exports.ErrorView = exports.DialerView = void 0;
var VoipDialerView_1 = require("./VoipDialerView");
Object.defineProperty(exports, "DialerView", { enumerable: true, get: function () { return __importDefault(VoipDialerView_1).default; } });
var VoipErrorView_1 = require("./VoipErrorView");
Object.defineProperty(exports, "ErrorView", { enumerable: true, get: function () { return __importDefault(VoipErrorView_1).default; } });
var VoipIncomingView_1 = require("./VoipIncomingView");
Object.defineProperty(exports, "VoipIncomingView", { enumerable: true, get: function () { return __importDefault(VoipIncomingView_1).default; } });
var VoipOutgoingView_1 = require("./VoipOutgoingView");
Object.defineProperty(exports, "VoipOutgoingView", { enumerable: true, get: function () { return __importDefault(VoipOutgoingView_1).default; } });
var VoipOngoingView_1 = require("./VoipOngoingView");
Object.defineProperty(exports, "VoipOngoingView", { enumerable: true, get: function () { return __importDefault(VoipOngoingView_1).default; } });
