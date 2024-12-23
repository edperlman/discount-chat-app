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
exports.getLoggedInUser = getLoggedInUser;
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
function getLoggedInUser(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = request.headers['x-auth-token'];
        const userId = request.headers['x-user-id'];
        if (!token || !userId || typeof token !== 'string' || typeof userId !== 'string') {
            return null;
        }
        return models_1.Users.findOneByIdAndLoginToken(userId, accounts_base_1.Accounts._hashLoginToken(token), { projection: { username: 1 } });
    });
}
