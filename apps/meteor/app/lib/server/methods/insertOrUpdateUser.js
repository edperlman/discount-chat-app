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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const twoFactorRequired_1 = require("../../../2fa/server/twoFactorRequired");
const saveUser_1 = require("../functions/saveUser");
const deprecationWarningLogger_1 = require("../lib/deprecationWarningLogger");
meteor_1.Meteor.methods({
    insertOrUpdateUser: (0, twoFactorRequired_1.twoFactorRequired)((userData) => __awaiter(void 0, void 0, void 0, function* () {
        deprecationWarningLogger_1.methodDeprecationLogger.method('insertOrUpdateUser', '8.0.0');
        (0, check_1.check)(userData, Object);
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'insertOrUpdateUser',
            });
        }
        return (0, saveUser_1.saveUser)(userId, userData);
    })),
});
