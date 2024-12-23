"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAppRoot = void 0;
const MockedAppRootBuilder_1 = require("./MockedAppRootBuilder");
const mockAppRoot = () => new MockedAppRootBuilder_1.MockedAppRootBuilder();
exports.mockAppRoot = mockAppRoot;
__exportStar(require("./MockedRouterContext"), exports);
__exportStar(require("./MockedAuthorizationContext"), exports);
__exportStar(require("./MockedModalContext"), exports);
__exportStar(require("./MockedServerContext"), exports);
__exportStar(require("./MockedSettingsContext"), exports);
__exportStar(require("./MockedUserContext"), exports);
__exportStar(require("./MockedDeviceContext"), exports);
