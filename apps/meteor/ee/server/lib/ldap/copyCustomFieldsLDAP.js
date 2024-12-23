"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyCustomFieldsLDAP = void 0;
const replacesNestedValues_1 = require("./replacesNestedValues");
const templateVarHandler_1 = require("../../../../app/utils/lib/templateVarHandler");
const getNestedProp_1 = require("../../../../server/lib/getNestedProp");
const copyCustomFieldsLDAP = ({ ldapUser, userData, customFieldsSettings, customFieldsMap, syncCustomFields, }, logger) => {
    if (!syncCustomFields) {
        return;
    }
    if (!customFieldsMap || !customFieldsSettings) {
        if (customFieldsMap) {
            logger.debug('Skipping LDAP custom fields because there are no custom map fields configured.');
            return;
        }
        logger.debug('Skipping LDAP custom fields because there are no custom fields configured.');
        return;
    }
    const map = (() => {
        try {
            return JSON.parse(customFieldsMap);
        }
        catch (err) {
            logger.error({ msg: 'Error parsing LDAP custom fields map.', err });
        }
    })();
    if (!map) {
        return;
    }
    let customFields;
    try {
        customFields = JSON.parse(customFieldsSettings);
    }
    catch (err) {
        logger.error({ msg: 'Failed to parse Custom Fields', err });
        return;
    }
    Object.entries(map).forEach(([ldapField, userField]) => {
        if (!(0, getNestedProp_1.getNestedProp)(customFields, userField)) {
            logger.debug(`User attribute does not exist: ${userField}`);
            return;
        }
        const value = (0, templateVarHandler_1.templateVarHandler)(ldapField, ldapUser);
        if (!value) {
            return;
        }
        userData.customFields = (0, replacesNestedValues_1.replacesNestedValues)(Object.assign({}, userData.customFields), userField, value);
    });
};
exports.copyCustomFieldsLDAP = copyCustomFieldsLDAP;
