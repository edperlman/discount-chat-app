"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const OTR_1 = __importDefault(require("./OTR"));
accounts_base_1.Accounts.onLogout(() => {
    OTR_1.default.closeAllInstances();
});
