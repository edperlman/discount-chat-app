"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomFields = validateCustomFields;
const stringUtils_1 = require("../../../../../lib/utils/stringUtils");
const i18n_1 = require("../../../../utils/lib/i18n");
function validateCustomFields(allowedCustomFields, customFields, { ignoreAdditionalFields = false, ignoreValidationErrors = false, } = {}) {
    const validValues = {};
    for (const cf of allowedCustomFields) {
        if (!customFields.hasOwnProperty(cf._id)) {
            if (cf.required && !ignoreValidationErrors) {
                throw new Error(i18n_1.i18n.t('error-invalid-custom-field-value', { field: cf.label }));
            }
            continue;
        }
        const cfValue = (0, stringUtils_1.trim)(customFields[cf._id]);
        if (!cfValue || typeof cfValue !== 'string') {
            if (cf.required && !ignoreValidationErrors) {
                throw new Error(i18n_1.i18n.t('error-invalid-custom-field-value', { field: cf.label }));
            }
            continue;
        }
        if (cf.regexp) {
            const regex = new RegExp(cf.regexp);
            if (!regex.test(cfValue)) {
                if (ignoreValidationErrors) {
                    continue;
                }
                throw new Error(i18n_1.i18n.t('error-invalid-custom-field-value', { field: cf.label }));
            }
        }
        validValues[cf._id] = cfValue;
    }
    if (!ignoreAdditionalFields) {
        const allowedCustomFieldIds = new Set(allowedCustomFields.map((cf) => cf._id));
        for (const key in customFields) {
            if (!allowedCustomFieldIds.has(key)) {
                throw new Error(i18n_1.i18n.t('error-custom-field-not-allowed', { key }));
            }
        }
    }
    return validValues;
}
