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
exports.mapVisitorToContact = mapVisitorToContact;
const getAllowedCustomFields_1 = require("./getAllowedCustomFields");
const getContactManagerIdByUsername_1 = require("./getContactManagerIdByUsername");
const validateCustomFields_1 = require("./validateCustomFields");
function mapVisitorToContact(visitor, source) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        return {
            name: visitor.name || visitor.username,
            emails: (_a = visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a.map(({ address }) => address),
            phones: (_b = visitor.phone) === null || _b === void 0 ? void 0 : _b.map(({ phoneNumber }) => phoneNumber),
            unknown: !visitor.activity || visitor.activity.length === 0,
            channels: [
                {
                    name: source.label || source.type.toString(),
                    visitor: {
                        visitorId: visitor._id,
                        source: Object.assign({ type: source.type }, (source.id ? { id: source.id } : {})),
                    },
                    blocked: false,
                    verified: false,
                    details: source,
                    lastChat: visitor.lastChat,
                },
            ],
            customFields: visitor.livechatData &&
                (0, validateCustomFields_1.validateCustomFields)(yield (0, getAllowedCustomFields_1.getAllowedCustomFields)(), visitor.livechatData, {
                    ignoreAdditionalFields: true,
                    ignoreValidationErrors: true,
                }),
            shouldValidateCustomFields: false,
            lastChat: visitor.lastChat,
            contactManager: ((_c = visitor.contactManager) === null || _c === void 0 ? void 0 : _c.username) && (yield (0, getContactManagerIdByUsername_1.getContactManagerIdByUsername)(visitor.contactManager.username)),
        };
    });
}
