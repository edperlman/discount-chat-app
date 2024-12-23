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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const ajv_1 = __importDefault(require("ajv"));
const server_1 = require("../../../../../app/api/server");
const logger_1 = require("../lib/logger");
const contacts_1 = require("./lib/contacts");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const blockContactSchema = {
    type: 'object',
    properties: {
        visitor: rest_typings_1.ContactVisitorAssociationSchema,
    },
    required: ['visitor'],
    additionalProperties: false,
};
const isBlockContactProps = ajv.compile(blockContactSchema);
server_1.API.v1.addRoute('omnichannel/contacts.block', {
    authRequired: true,
    permissionsRequired: ['block-livechat-contact'],
    validateParams: isBlockContactProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, contacts_1.ensureSingleContactLicense)();
            const { visitor } = this.bodyParams;
            const { user } = this;
            yield (0, contacts_1.changeContactBlockStatus)({
                visitor,
                block: true,
            });
            logger_1.logger.info(`Visitor with id ${visitor.visitorId} blocked by user with id ${user._id}`);
            yield (0, contacts_1.closeBlockedRoom)(visitor, user);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.unblock', {
    authRequired: true,
    permissionsRequired: ['unblock-livechat-contact'],
    validateParams: isBlockContactProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, contacts_1.ensureSingleContactLicense)();
            const { visitor } = this.bodyParams;
            const { user } = this;
            yield (0, contacts_1.changeContactBlockStatus)({
                visitor,
                block: false,
            });
            logger_1.logger.info(`Visitor with id ${visitor.visitorId} unblocked by user with id ${user._id}`);
            return server_1.API.v1.success();
        });
    },
});
