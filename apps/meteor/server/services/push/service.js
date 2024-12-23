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
exports.PushService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
class PushService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'push';
        this.onEvent('watch.users', (data) => __awaiter(this, void 0, void 0, function* () {
            // for some reason data.diff can be set to undefined
            if (!('diff' in data) || !data.diff || !('services.resume.loginTokens' in data.diff)) {
                return;
            }
            if (data.diff['services.resume.loginTokens'] === undefined) {
                yield models_1.PushToken.removeAllByUserId(data.id);
                return;
            }
            const loginTokens = Array.isArray(data.diff['services.resume.loginTokens']) ? data.diff['services.resume.loginTokens'] : [];
            const tokens = loginTokens.map(({ hashedToken }) => hashedToken);
            if (tokens.length > 0) {
                yield models_1.PushToken.removeByUserIdExceptTokens(data.id, tokens);
            }
        }));
    }
}
exports.PushService = PushService;
