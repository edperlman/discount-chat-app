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
exports.twoFactorRequired = twoFactorRequired;
const meteor_1 = require("meteor/meteor");
const index_1 = require("./code/index");
function twoFactorRequired(fn, options) {
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'twoFactorRequired' });
            }
            // get two factor options from last item of args and remove it
            const twoFactor = args.pop();
            if (twoFactor) {
                if (twoFactor.twoFactorCode && twoFactor.twoFactorMethod) {
                    yield (0, index_1.checkCodeForUser)({
                        user: this.userId,
                        connection: this.connection || undefined,
                        code: twoFactor.twoFactorCode,
                        method: twoFactor.twoFactorMethod,
                        options,
                    });
                    this.twoFactorChecked = true;
                }
                else {
                    // if it was not two factor options, put it back
                    args.push(twoFactor);
                }
            }
            if (!this.twoFactorChecked) {
                yield (0, index_1.checkCodeForUser)({ user: this.userId, connection: this.connection || undefined, options });
            }
            return fn.apply(this, args);
        });
    };
}
