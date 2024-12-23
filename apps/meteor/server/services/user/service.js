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
exports.UserService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const getMaxLoginTokens_1 = require("../../lib/getMaxLoginTokens");
// TODO merge this service with Account service
class UserService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'user';
    }
    ensureLoginTokensLimit(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ tokens }] = yield models_1.Users.findAllResumeTokensByUserId(uid);
            if (tokens.length < (0, getMaxLoginTokens_1.getMaxLoginTokens)()) {
                return;
            }
            const oldestDate = tokens.reverse()[(0, getMaxLoginTokens_1.getMaxLoginTokens)() - 1];
            yield models_1.Users.removeOlderResumeTokensByUserId(uid, oldestDate.when);
        });
    }
}
exports.UserService = UserService;
