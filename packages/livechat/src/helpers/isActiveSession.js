"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActiveSession = void 0;
const store_1 = __importDefault(require("../store"));
const isActiveSession = () => {
    const sessionId = sessionStorage.getItem('sessionId');
    const { openSessionIds: [firstSessionId] = [] } = store_1.default.state;
    return sessionId === firstSessionId;
};
exports.isActiveSession = isActiveSession;
