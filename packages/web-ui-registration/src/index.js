"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordPage = exports.CMSPage = void 0;
const CMSPage_1 = __importDefault(require("./CMSPage"));
exports.CMSPage = CMSPage_1.default;
const RegistrationPageRouter_1 = __importDefault(require("./RegistrationPageRouter"));
const ResetPasswordPage_1 = __importDefault(require("./ResetPassword/ResetPasswordPage"));
exports.ResetPasswordPage = ResetPasswordPage_1.default;
exports.default = RegistrationPageRouter_1.default;
