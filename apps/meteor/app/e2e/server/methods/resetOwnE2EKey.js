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
const meteor_1 = require("meteor/meteor");
const resetUserE2EKey_1 = require("../../../../server/lib/resetUserE2EKey");
const twoFactorRequired_1 = require("../../../2fa/server/twoFactorRequired");
meteor_1.Meteor.methods({
    'e2e.resetOwnE2EKey': (0, twoFactorRequired_1.twoFactorRequired)(() => __awaiter(void 0, void 0, void 0, function* () {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'resetOwnE2EKey',
            });
        }
        if (!(yield (0, resetUserE2EKey_1.resetUserE2EEncriptionKey)(userId, false))) {
            return false;
        }
        return true;
    })),
});
