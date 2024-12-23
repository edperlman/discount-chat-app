"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Do not disclose if user exists when password is invalid
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const { _runLoginHandlers } = accounts_base_1.Accounts;
accounts_base_1.Accounts._options.ambiguousErrorMessages = true;
accounts_base_1.Accounts._runLoginHandlers = function (methodInvocation, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield _runLoginHandlers.call(accounts_base_1.Accounts, methodInvocation, options);
        if (result.error instanceof meteor_1.Meteor.Error) {
            result.error = new meteor_1.Meteor.Error(401, 'User not found');
        }
        return result;
    });
};
