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
exports.generateAccessToken = generateAccessToken;
const core_services_1 = require("@rocket.chat/core-services");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../lib/deprecationWarningLogger");
function generateAccessToken(callee, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!['yes', 'true'].includes(String(process.env.CREATE_TOKENS_FOR_USERS)) ||
            (callee !== userId && !(yield (0, hasPermission_1.hasPermissionAsync)(callee, 'user-generate-access-token')))) {
            throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', { method: 'createToken' });
        }
        const token = accounts_base_1.Accounts._generateStampedLoginToken();
        accounts_base_1.Accounts._insertLoginToken(userId, token);
        yield core_services_1.User.ensureLoginTokensLimit(userId);
        return {
            userId,
            authToken: token.token,
        };
    });
}
meteor_1.Meteor.methods({
    createToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            deprecationWarningLogger_1.methodDeprecationLogger.method('createToken', '8.0.0');
            const callee = meteor_1.Meteor.userId();
            if (!callee) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'createToken' });
            }
            return generateAccessToken(callee, userId);
        });
    },
});
