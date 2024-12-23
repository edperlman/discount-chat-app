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
exports.ContactConverter = void 0;
const models_1 = require("@rocket.chat/models");
const RecordConverter_1 = require("./RecordConverter");
const createContact_1 = require("../../../../livechat/server/lib/contacts/createContact");
const getAllowedCustomFields_1 = require("../../../../livechat/server/lib/contacts/getAllowedCustomFields");
const validateCustomFields_1 = require("../../../../livechat/server/lib/contacts/validateCustomFields");
class ContactConverter extends RecordConverter_1.RecordConverter {
    convertCustomFields(customFields) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customFields) {
                return;
            }
            const allowedCustomFields = yield (0, getAllowedCustomFields_1.getAllowedCustomFields)();
            return (0, validateCustomFields_1.validateCustomFields)(allowedCustomFields, customFields, { ignoreAdditionalFields: true });
        });
    }
    convertRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = record;
            yield (0, createContact_1.createContact)({
                name: data.name || (yield this.generateNewContactName()),
                emails: data.emails,
                phones: data.phones,
                customFields: yield this.convertCustomFields(data.customFields),
                contactManager: yield this._cache.getIdOfUsername(data.contactManager),
                unknown: false,
                importIds: data.importIds,
            });
            return true;
        });
    }
    generateNewContactName() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.LivechatVisitors.getNextVisitorUsername();
        });
    }
    getDataType() {
        return 'contact';
    }
}
exports.ContactConverter = ContactConverter;
