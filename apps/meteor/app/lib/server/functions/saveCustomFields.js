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
exports.saveCustomFields = void 0;
const saveCustomFieldsWithoutValidation_1 = require("./saveCustomFieldsWithoutValidation");
const validateCustomFields_1 = require("./validateCustomFields");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const server_1 = require("../../../settings/server");
const saveCustomFields = function (userId, formData) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, stringUtils_1.trim)(server_1.settings.get('Accounts_CustomFields')) !== '') {
            (0, validateCustomFields_1.validateCustomFields)(formData);
            return (0, saveCustomFieldsWithoutValidation_1.saveCustomFieldsWithoutValidation)(userId, formData);
        }
    });
};
exports.saveCustomFields = saveCustomFields;
