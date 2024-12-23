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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const sendMail_1 = require("../../../mail-messages/server/functions/sendMail");
const Mailer_1 = require("../../../mail-messages/server/lib/Mailer");
const api_1 = require("../api");
api_1.API.v1.addRoute('mailer', {
    authRequired: true,
    validateParams: rest_typings_1.isMailerProps,
    permissionsRequired: ['send-mail'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { from, subject, body, dryrun, query } = this.bodyParams;
            const result = yield (0, sendMail_1.sendMail)({ from, subject, body, dryrun: Boolean(dryrun), query });
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('mailer.unsubscribe', {
    authRequired: true,
    validateParams: rest_typings_1.isMailerUnsubscribeProps,
    rateLimiterOptions: { intervalTimeInMS: 60000, numRequestsAllowed: 1 },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, createdAt } = this.bodyParams;
            yield Mailer_1.Mailer.unsubscribe(_id, createdAt);
            return api_1.API.v1.success();
        });
    },
});
