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
exports.createContact = createContact;
const models_1 = require("@rocket.chat/models");
const getAllowedCustomFields_1 = require("./getAllowedCustomFields");
const validateContactManager_1 = require("./validateContactManager");
const validateCustomFields_1 = require("./validateCustomFields");
function createContact(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, emails, phones, customFields: receivedCustomFields = {}, lastChat, contactManager, channels = [], unknown, importIds, shouldValidateCustomFields = true, }) {
        if (contactManager) {
            yield (0, validateContactManager_1.validateContactManager)(contactManager);
        }
        const customFields = shouldValidateCustomFields
            ? (0, validateCustomFields_1.validateCustomFields)(yield (0, getAllowedCustomFields_1.getAllowedCustomFields)(), receivedCustomFields)
            : receivedCustomFields;
        return models_1.LivechatContacts.insertContact(Object.assign({ name, emails: emails === null || emails === void 0 ? void 0 : emails.map((address) => ({ address })), phones: phones === null || phones === void 0 ? void 0 : phones.map((phoneNumber) => ({ phoneNumber })), contactManager,
            channels,
            customFields,
            lastChat,
            unknown }, ((importIds === null || importIds === void 0 ? void 0 : importIds.length) && { importIds })));
    });
}
