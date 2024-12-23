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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const ajv_1 = __importDefault(require("ajv"));
const api_1 = require("../api");
const webdav_1 = require("../lib/webdav");
// TO-DO: remove this AJV instance and import one from the core-typings
const ajv = new ajv_1.default({ coerceTypes: true });
const POSTRemoveWebdavAccountSchema = {
    type: 'object',
    properties: {
        accountId: {
            type: 'string',
        },
    },
    required: ['accountId'],
    additionalProperties: false,
};
const isPOSTRemoveWebdavAccount = ajv.compile(POSTRemoveWebdavAccountSchema);
api_1.API.v1.addRoute('webdav.getMyAccounts', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({
                accounts: yield (0, webdav_1.findWebdavAccountsByUserId)({ uid: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('webdav.removeWebdavAccount', {
    authRequired: true,
    validateParams: isPOSTRemoveWebdavAccount,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this.bodyParams;
            const removed = yield models_1.WebdavAccounts.removeByUserAndId(accountId, this.userId);
            if (removed) {
                void core_services_1.api.broadcast('notify.webdav', this.userId, {
                    type: 'removed',
                    account: { _id: accountId },
                });
            }
            return api_1.API.v1.success({ result: removed });
        });
    },
});
